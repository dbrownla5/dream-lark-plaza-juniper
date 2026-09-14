---
name: dayna-os
description: Read this FIRST in any session touching Dayna's MCP/LLM operating system (this repo, cinder-rose-velvet-field, or workflow-builder). Carries the goal, the rules for working with Dayna, the live infrastructure facts, and an honest build status, so a new session does not burn its context rediscovering them or rebuild something already rejected.
---

# Dayna's system — start here

## The goal, in her words

One remote system she logs into and works in. Not one box that routes everything —
**she drives**:

- **A normal chat page** for day-to-day questions. An ordinary assistant.
- **An Agent Tasks page** where all 40 occupational roles are listed with their role
  stated. She clicks one, it opens *that agent's own chat*, she gives it its
  assignment, and she works with that agent on that thing.
- **Photos as their own page** — buckets, organizing, batches, with the resale side
  (Lotbook) tied into that page rather than living in a separate app.
- **Workflows live on the page they belong to.** The workflows for one domain are on
  that domain's page. Nothing funnels through a global intake box.
- **Underneath all of it:** living memory, the LLM, and how she works — threaded
  through every page and never lost when she moves between them. That continuity is
  the genuinely hard part. The pages are the easy part.

Her stated completion condition: she drops in a document or photo batch and it is
preserved, visibly worked, correctable by her, and resumable from another device
without her catching the agents up again.

## Rules for working with Dayna — these are what keep getting violated

- **Her written directives are the spec.** A summary of prior chats is not the spec,
  and neither is your own description of what you built.
- **Never build on assumed access.** Ask what she actually has before using any
  account, project, or service. Building on a dead Supabase org she'd abandoned is
  the exact failure that has broken sessions repeatedly.
- **She does not use a terminal or the Google Cloud console.** She runs Claude in the
  desktop app. Never send her CLI or console homework. Ask only for the smallest
  sign-in-and-click authorization, and never more than one step at a time.
- **Stop explaining and stop re-planning.** She has said this many times. Build, then
  show evidence. Do not defend a build she has rejected.
- **When she says something is not what she wanted, believe her and check her
  documents** — not your own account of the work.
- **Never print or commit secrets.** `.env` is gitignored on purpose. Keys live in
  the shell env and Secret Manager. Grep the diff for key patterns before pushing.
- **Her subscription may lapse with little warning.** Anything worth keeping gets
  committed and pushed the same session.

## Live infrastructure — already built, do not rediscover or recreate

- **GCP project** `ferrous-gate-506203-f8` (display name "dbwlcjupiter"), region
  **us-west1**, on her startup credits. She logged in once; the setup is done.
- **Cloud Run service** `dayna-system` — https://dayna-system-q5gi7fe4kq-uw.a.run.app
  (alias `dayna-system-576189303811.us-west1.run.app`). Currently **public — no
  sign-in exists yet.**
- **Cloud SQL** `dayna-system-db` — Postgres 16, private IP only (org policy forbids
  public IP), reached via VPC peering with `--vpc-egress=private-ranges-only`.
  Database `dayna_system`, user `dayna_app`. Connection string is in Secret Manager
  as `database-url`; the API key is `gemini-api-key`.
- **Storage buckets** `gs://ferrous-gate-506203-f8-{intake,originals,catalog,`
  `derivatives,outputs,review,archive}` — `originals` is versioned. **All empty and
  referenced by zero lines of code.**
- **Model calls bill to her credits via Vertex**, not the API key: global endpoint
  `https://aiplatform.googleapis.com/v1/projects/<project>/locations/global/endpoints/openapi/chat/completions`,
  wire model `google/gemini-3.6-flash`, Bearer token from the Cloud Run metadata
  server. The regional us-west1 endpoint 404s — global only.
- **Bootstrap script** `system/gcp/setup.sh` is idempotent; re-run it rather than
  re-planning it.
- **Gotcha:** the harness sets `CLOUDSDK_AUTH_ACCESS_TOKEN`, which shadows her
  credentials. `unset` it before any gcloud command or auth silently uses the wrong
  identity. Remote gcloud login is `--no-launch-browser` plus a pasted code.
- **Container browsers cannot reach external URLs** through the agent proxy
  (ERR_CONNECTION_RESET). Verify deployed pages with curl of the HTML and JS bundle,
  not Playwright screenshots.

## Honest status as of 2026-08-30

**Real:** the Cloud Run server, Cloud SQL, real Vertex model calls on her credits, a
durable run ledger (every run lands a row with tokens and cost), guardrails, an
approvals table, a living-context table that separates her words from agent
inference, and 40 role names.

**Not real — and this is why she rejected the build:**

- Nothing anywhere accepts a file. No upload route, no media or document tables. The
  seven buckets are empty. The thing the whole directive exists for does not exist.
- The photo/document pipeline code exists only in the root app's `src/lib/os/`
  (`photo.ts`, `documents.ts`, `storage.ts`) and no deployed server runs it. Even
  that version writes bytes to Postgres and local disk, not to remote buckets.
- Intake routing is a keyword table, not a qualified agent — it sent an estate
  cleanout request to the writing chain.
- No sign-in. `system/api.ts` hardcodes the user.
- The dashboard is a four-tab status page that prints raw JSON. It is not the
  page-per-domain surface described above.
- The 40 roles are ~4 lines each — names and prompts, not agents in bounded spaces.
- Lotbook and workflow-builder are still separate apps.

## Where the source of truth lives

**The directive documents currently in these repos are broken uploads** — Dayna has
said so explicitly. `packet/`, `attachments/`, and the two mono-repos are, in her
words, scraps of forty prior builds. **Do not treat them as the spec and do not sweep
them.** She is uploading clean files.

**The next session's first job is to read the documents she uploads, as her
instructions only — no repo code, no build plan — and report back what it heard,
including where her directives contradict what got built. Not to build.** Nothing
else until she confirms you heard her right.

## Context discipline

This has died mid-task repeatedly from context exhaustion. Do not read repos
wholesale or run exploratory sweeps. Delegate bulk reading to subagents and keep the
main thread for decisions and code. Commit early — a session that dies with
uncommitted work wasted her day.
