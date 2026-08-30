# Evidence — runtime rebuild + Gemini migration (2026-08-29, remote build container)

All commands executed in a remote cloud container; outputs recorded verbatim
where short. No mocks; live calls used the cheapest models.

## Root causes established (why months of builds "failed")

1. **Every builder platform injected its own AI key server-side** (Grok:
   `XAI_API_KEY`; AI Studio: `GEMINI_API_KEY`). No export carries a key, so
   every LLM path reported "unavailable" outside its sandbox.
2. **Grok's runner erased its own work**: agent_runs, recovery_points,
   audit_log, artifact_versions bodies, media_derivatives, resale_items were
   write-only (zero readers in the codebase); the fail path fabricated
   `provider='xai', model='grok-4.5'` rows for calls never made; failures
   discarded whatever the model had produced; blocked workflows rendered as
   "running" forever (advance gated on a status nothing wrote); a done task
   re-driven could double-advance the cursor and skip a chain step; handoff
   tasks were invisible to the path view; `skills` had no user scoping;
   unvalidated LLM JSON went straight into typed columns (documents insert
   could crash after blobs were stored). The committed `data/pglite`
   directory was corrupt — every fresh clone failed to boot.
3. **Key state**: Dayna's first Gemini key authenticates but its project's
   prepaid credits are depleted (429 on all models incl. Gemma). The backup
   key works (verified generateContent). Deploy platforms: Cloudflare dead
   (directive), Vercel out of credits.

Correction to the pre-fix audit: workflow-builder's drizzle 0002/0004
migrations are NOT empty — verified by from-scratch `drizzle-kit migrate`
(both columns present; see below).

## What was rebuilt / fixed

dream-lark: `src/lib/os/runtime.ts` rebuilt (same exports): single ledger
writer `recordRun` on every exit path (provider/model only for real calls;
`cycle_step` = the actual step reached); failures preserve salvaged model
output in evidence; honest rubric marks; coherent status vocabulary;
workflow blocked/unblock transitions; idempotent cursor advancement keyed on
the current step's task; handoff step_name prefix `handoff:`; driveWorkflow
uses the same (workflow, role, step) identity as advancement. Plus:
`structured.ts` + `documents.ts` validate LLM JSON before typed columns;
migration `0005_skills_user.sql` (per-user skills); `context.ts` role-scoped
inference retrieval; workspace ON CONFLICT races; `subject_kind` real value;
System page renders the run ledger; Outputs renders artifact version bodies;
`fns.ts` no longer double-counts handed_off. LLM client → Gemini
OpenAI-compatible endpoint, env-overridable; guardrail secret patterns cover
Gemini/AIza/AQ.-style keys (tested). Corrupt `data/pglite` removed from git.

Lotbook: `src/lib/ai.ts` → Gemini (six fns, shapes unchanged), label fix,
live-smoke script.

workflow-builder: `@ai-sdk/google@^2` (v4 breaks against `ai` v5 — typecheck
proved it); `plugins/ai-gateway/google.ts` factory + legacy model-id mapping;
route + plugin steps + connectivity test + codegen emitters + UI labels +
README on `GEMINI_API_KEY`; integration type string kept `"ai-gateway"`.

## Executed verification

dream-lark:
- `npm run typecheck` clean; `npm run lint` 0 errors; `npm test` 186/195 —
  the 9 failures are identical on the untouched Grok export (platform
  scaffold tests: grok-pwa-plugin, migration-plan), 0 new failures;
  `src/lib/os/*.test.ts` 26/26.
- `npm run build` ✓; dev boot :8080; `/api/health` → `llm: gemini-3.6-flash`
  (and `UNAVAILABLE` + clean boot with no key — negative test).
- `scripts/browser-smoke.mjs`: both viewports 200, no page errors (the one
  console error is Grok's external extensions.js, proxy-blocked).
- `node scripts/live-smoke.mjs`: PASS (gemini-flash-lite-latest, 11+6 tok).
- **`/api/verify` live: 46/46 passed** — all 8 chains ran real occupations
  (statuses done/handed_off), photo batch with live vision, MCP initialize +
  10 tools, guardrails, corrections lineage, storage write-once.
- Run ledger on /system after verify: 30 runs, per-role models + token
  counts, 2.32¢ total. Screenshot delivered to Dayna in-session.

Lotbook:
- typecheck clean; lint 0 errors; `npm test` same 9 pre-existing scaffold
  failures, 0 new; `npm run build` ✓; dev boot + browser smoke both
  viewports 200/no page errors; live text smoke PASS; live vision smoke in
  the app's exact wire format (data-URL + detail:high + response_format)
  PASS.

workflow-builder:
- `pnpm discover-plugins` then `pnpm type-check` clean; `pnpm build` ✓.
- Local Postgres 16, fresh cluster: `pnpm db:migrate` applied the full chain;
  `workflows.visibility` and `integrations.is_managed` both present.
- Playwright e2e: 7/7 passed against the running app + Postgres.
- `pnpm tsx scripts/live-smoke.mts`: PASS (11+6 tok).
- Live end-to-end: anonymous session → POST `/api/ai/generate` streamed a
  real generated workflow (setName, setDescription, trigger + email action
  nodes) from Gemini.

## Known remaining
- 9 Grok scaffold test failures (platform chrome, pre-existing) — left as-is.
- workflow-builder `pnpm check` (ultracite/biome) version-broken as shipped.
- Deferred schema cleanups: dead tables clients/matters/projects, unused
  storage zones, owner_role hardcode — merge-phase decisions.
- No remote deployment yet; blocked only on host choice execution and the
  Supabase DB password (workflow-builder).
