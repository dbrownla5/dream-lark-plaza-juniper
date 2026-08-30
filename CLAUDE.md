# Dayna's MCP/LLM Operating System (the product)

**START HERE: `system/` is the successor build** — Dayna's chosen simple
stack (Express + Vite/React + Postgres + Gemini, one `.env`), rebuilt from
the packet spec with the clean engine. The root TanStack app is the Grok-era
reference implementation: keep it running as the source to port from
(photo/document pipelines, storage zones), build new work in `system/`.

Read `packet/control_repo/dayna_build_control/README.md`, `contracts/`, and
`LAST_HANDOFF.md` BEFORE working. Those documents are the source of truth for
what this system is and how work is proven. Non-negotiables: evidence over
claims, no mocks in production paths, remote/off-site production (never
localhost-as-production), keep the 40 occupational roles distinct, never
print or commit secrets, don't replace building with re-planning.

This repo is ONE system with two sibling repos feeding it:
`cinder-rose-velvet-field` (Lotbook — photo intake/resale domain) and
`workflow-builder` (workflow engine domain). End state: one remote server
dashboard ecosystem (see `attachments/Controlling_PlatformChange_Directive`).
Cloudflare is dead. Vercel is out (no credits). Deploy targets: Netlify free
tier or the `adapters/node-host/Dockerfile` on any container host; Supabase
free tier for Postgres.

## LLM provider (rebuilt off Grok's sandbox)

Single client: `src/lib/os/llm.ts` — Gemini OpenAI-compatible endpoint.
Env contract (server-only, NEVER committed; `.env` is gitignored on purpose):
- `GEMINI_API_KEY` — the key (Dayna provides it; ask her, do not invent).
- `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL` — optional overrides so any
  OpenAI-compatible provider (Groq, OpenRouter, xAI) drops in.
- Default model `gemini-3.6-flash`; smoke tests use `gemini-flash-lite-latest`.
- `DATABASE_URL` — optional; PGlite fallback self-migrates. `data/pglite/` is
  machine-local state, never committed.

## Agent runtime

`src/lib/os/runtime.ts` was REBUILT (Grok's original erased its own work).
Invariants to preserve: every run exits through `recordRun` (durable
agent_runs row + recovery point; provider/model only when a real call
happened); failures salvage partial model output into evidence instead of
discarding it; task statuses queued|running|waiting_approval|handed_off|
blocked|done only; workflow cursor advances only from the current step's
completing task; handoff side-tasks use `step_name` prefix `handoff:` and
never move the chain; skills are per-user (`migrations/0005_skills_user.sql`).

## Going live (Dayna says "set up Google")

When Dayna asks to set up Google / deploy / go live, on a machine where her
browser can log in (her PC): run `system/gcp/setup.sh` end to end. Do NOT
re-plan it, question it, or substitute another platform — it is the agreed
path (Cloud Run + Cloud Storage + Cloud SQL on her startup credits). The only
human step it contains is one Google sign-in click. If a step fails, fix and
re-run (it is idempotent). Never ask her to navigate the Google Cloud console.

## Verify (all proven green in a remote container, 2026-08-29)

`npm run typecheck && npm run lint && npm test` (9 pre-existing scaffold
test failures in grok-pwa/migration-plan are Grok's, not the app's),
`npm run build`, dev on :8080 → `/api/health`, `scripts/browser-smoke.mjs`,
`node scripts/live-smoke.mjs` (1 live call), and `/api/verify` = the full
live acceptance surface (46 checks incl. all 8 chains on real Gemini).
