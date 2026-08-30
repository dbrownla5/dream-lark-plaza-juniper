#!/usr/bin/env bash
# One-shot Google Cloud bootstrap for Dayna's System.
# Run by a Claude session on Dayna's own machine (where her Google login can
# happen) — or by anyone in a terminal. Idempotent: safe to re-run after any
# failure; every step checks before it creates.
#
# What it does, start to finish:
#   1. Signs into Google Cloud (one browser "Allow" click — the ONLY human step)
#   2. Creates the project and links the billing account (startup credits)
#   3. Enables the needed services (Cloud Run, Storage, SQL, Vision, Build)
#   4. Creates the storage containers for the corpus (write-once originals)
#   5. Creates the Postgres database with an app login
#   6. Builds and deploys the system to Cloud Run (public URL at the end)
#
# Requires: gcloud CLI (https://cloud.google.com/sdk — winget install Google.CloudSDK)
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-dayna-system}"
REGION="${REGION:-us-west1}"
SERVICE="dayna-system"
DB_INSTANCE="dayna-system-db"
DB_NAME="dayna_system"
DB_USER="dayna_app"
BUCKET_ZONES=(intake originals catalog derivatives outputs review archive)

say() { printf '\n=== %s\n' "$*"; }

# --- 1. Auth (the one human step: a browser opens, pick the account that has
# the startup credits, click Allow) ---------------------------------------
if ! gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q .; then
  say "Signing in — a browser window will open. Pick the business Google account and click Allow."
  gcloud auth login
fi
ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format='value(account)')
say "Signed in as $ACCOUNT"

# --- 2. Project + billing --------------------------------------------------
if ! gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  say "Creating project $PROJECT_ID"
  gcloud projects create "$PROJECT_ID" --name="Dayna System"
fi
gcloud config set project "$PROJECT_ID" >/dev/null

if [ "$(gcloud billing projects describe "$PROJECT_ID" --format='value(billingEnabled)')" != "True" ]; then
  say "Linking billing (the startup credits live on a billing account)"
  BILLING=$(gcloud billing accounts list --filter='open=true' --format='value(name)' | head -1)
  if [ -z "$BILLING" ]; then
    echo "No open billing account visible to $ACCOUNT — sign in with the account that has the startup credits and re-run."
    exit 1
  fi
  COUNT=$(gcloud billing accounts list --filter='open=true' --format='value(name)' | wc -l)
  if [ "$COUNT" -gt 1 ]; then
    say "Multiple billing accounts found — listing them; set BILLING_ACCOUNT=<name> and re-run to pick one:"
    gcloud billing accounts list
    BILLING="${BILLING_ACCOUNT:-$BILLING}"
  fi
  gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING"
fi
say "Billing linked"

# --- 3. Services -----------------------------------------------------------
say "Enabling services (takes a minute the first time)"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com storage.googleapis.com \
  sqladmin.googleapis.com vision.googleapis.com secretmanager.googleapis.com \
  servicenetworking.googleapis.com compute.googleapis.com

# --- 4. Storage containers -------------------------------------------------
for zone in "${BUCKET_ZONES[@]}"; do
  BUCKET="gs://${PROJECT_ID}-${zone}"
  if ! gcloud storage buckets describe "$BUCKET" >/dev/null 2>&1; then
    say "Creating container $BUCKET"
    gcloud storage buckets create "$BUCKET" --location="$REGION" --uniform-bucket-level-access
  fi
done
# Originals are write-once: keep every version, never silently overwrite.
gcloud storage buckets update "gs://${PROJECT_ID}-originals" --versioning || true
say "Storage containers ready"

# --- 5. Database (private IP only — org policy forbids public DB addresses) --
if ! gcloud compute addresses describe google-managed-services-default --global >/dev/null 2>&1; then
  say "Reserving private service range for the database network"
  gcloud compute addresses create google-managed-services-default \
    --global --purpose=VPC_PEERING --prefix-length=16 --network=default
fi
if ! gcloud services vpc-peerings list --network=default 2>/dev/null | grep -q servicenetworking; then
  say "Connecting private service access"
  gcloud services vpc-peerings connect --service=servicenetworking.googleapis.com \
    --ranges=google-managed-services-default --network=default
fi
if ! gcloud sql instances describe "$DB_INSTANCE" >/dev/null 2>&1; then
  say "Creating Postgres instance (private IP, smallest tier; ~minutes to provision)"
  gcloud sql instances create "$DB_INSTANCE" \
    --database-version=POSTGRES_16 --edition=enterprise --tier=db-g1-small \
    --region="$REGION" --storage-size=10GB --storage-auto-increase \
    --no-assign-ip --network=projects/$PROJECT_ID/global/networks/default
fi
gcloud sql databases create "$DB_NAME" --instance="$DB_INSTANCE" 2>/dev/null || true
DB_PASS_FILE="$HOME/.dayna-system-db-pass"
if [ ! -f "$DB_PASS_FILE" ]; then
  umask 077
  openssl rand -hex 24 > "$DB_PASS_FILE"
  gcloud sql users create "$DB_USER" --instance="$DB_INSTANCE" --password="$(cat "$DB_PASS_FILE")" \
    || gcloud sql users set-password "$DB_USER" --instance="$DB_INSTANCE" --password="$(cat "$DB_PASS_FILE")"
fi
DB_IP=$(gcloud sql instances describe "$DB_INSTANCE" --format='value(ipAddresses[].ipAddress)' | tr ';' '\n' | head -1)
DATABASE_URL="postgresql://${DB_USER}:$(cat "$DB_PASS_FILE")@${DB_IP}:5432/${DB_NAME}"
say "Database ready (private address $DB_IP)"

# --- 6. Secrets ------------------------------------------------------------
if [ -z "${GEMINI_API_KEY:-}" ]; then
  if [ -f "$(dirname "$0")/../.env" ]; then
    GEMINI_API_KEY=$(grep -E '^GEMINI_API_KEY=' "$(dirname "$0")/../.env" | cut -d= -f2-)
  fi
fi
if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "Set GEMINI_API_KEY in system/.env (or the environment) and re-run."
  exit 1
fi
printf '%s' "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null \
  || printf '%s' "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
printf '%s' "$DATABASE_URL" | gcloud secrets create database-url --data-file=- 2>/dev/null \
  || printf '%s' "$DATABASE_URL" | gcloud secrets versions add database-url --data-file=-

# --- 7. Deploy -------------------------------------------------------------
say "Building and deploying to Cloud Run (first build takes a few minutes)"
cd "$(dirname "$0")/.."
gcloud run deploy "$SERVICE" \
  --source . --region "$REGION" --allow-unauthenticated \
  --network=default --subnet=default --vpc-egress=private-ranges-only \
  --set-env-vars "VERTEX_PROJECT=$PROJECT_ID" \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest,DATABASE_URL=database-url:latest" \
  --memory 512Mi --min-instances 0 --max-instances 3

URL=$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')
say "LIVE: $URL"
say "Health check:"
curl -s "$URL/api/health" || true
echo
say "Done. The system is live at $URL — bookmark it. Storage containers: ${BUCKET_ZONES[*]} (gs://${PROJECT_ID}-<zone>)."
