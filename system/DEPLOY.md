# Deploying Dayna's System to Google Cloud Run (startup credits)

Everything below runs on the business Google Cloud account so the startup
credits pay for hosting, database, storage, and (with a key from the same
project) every Gemini call. No terminal needed — the console click-path:

## 1. One-time setup (in console.cloud.google.com, business account)

1. **Pick/confirm the project** that is linked to the billing account with
   the startup credits.
2. **Gemini key from this project**: aistudio.google.com/apikey → Create API
   key → choose this Cloud project. (Then all AI usage draws from credits.)
3. **Database**: SQL → Create instance → PostgreSQL (smallest tier is fine to
   start). Note the connection string. (Supabase free tier also works if
   preferred — the app only needs a `DATABASE_URL`.)

## 2. Deploy the app (no terminal)

Cloud Run → **Create service** → "Continuously deploy from a repository" →
connect GitHub → pick `dbrownla5/dream-lark-plaza-juniper`, branch
`claude/gemini-api-remote-deploy-aomod3` (or `main` after merge):

- Build type: **Dockerfile**, source directory **/system**
- Allow unauthenticated invocations (it's the dashboard; real sign-in is a
  next-pass item — until then keep the URL private or require auth here)
- Variables & secrets: add `GEMINI_API_KEY` and `DATABASE_URL`
  (use Secret Manager for both)

Every push to the branch then auto-deploys. The database schema applies
itself on startup.

## 3. The 200 GB (photo/media parsing) — the plan

- **Cloud Storage bucket** in the same project holds the originals
  (write-once; versioning on — nothing is ever overwritten or lost).
- The system's photo/document intake (next port from the reference app)
  reads from and writes to that bucket instead of local disk.
- Bulk parsing runs as **Cloud Run jobs** — the same container, run in batch
  mode over the bucket, calling Gemini for vision/classification — so the
  heavy 200 GB pass uses credits, scales out, and doesn't touch the
  dashboard's responsiveness.

## Cost picture

Cloud Run scales to zero when idle; smallest Cloud SQL + a 200 GB bucket +
Gemini Flash calls all bill against the startup credits. The dashboard's
built-in spend meter (default 500¢/day ceiling) still guards AI usage on
top of that.
