# Last Handoff

## Stage completed
Inventory + LLM-runtime rebuild pass (2026-08-29). Not a numbered stage seal;
evidence-backed state established across all three repos.

## Exact repo state
- Branch `claude/gemini-api-remote-deploy-aomod3` in all three repos.
- dream-lark: agent runtime REBUILT (`src/lib/os/runtime.ts`) — durable run
  ledger via `recordRun` on every path, failures salvage partial output,
  honest rubric, fixed workflow state machine (blocked/unblock, idempotent
  cursor, handoff identity), per-user skills (migration 0005), LLM JSON
  validated before typed columns, run ledger + artifact bodies rendered in
  System/Outputs. LLM client on Gemini (`GEMINI_API_KEY`, overridable).
  Corrupt committed `data/pglite` removed (broke every fresh clone).
- Lotbook: `src/lib/ai.ts` on Gemini, six server fns unchanged in shape.
- workflow-builder: `@ai-sdk/google@^2`, route/plugin/codegen/UI rewired;
  migrations verified from scratch (visibility/is_managed present).

## Working components (dev-container evidence, not deployed)
Live Gemini across all three: dream-lark `/api/verify` 46/46 (8 chains,
vision, MCP, guardrails, corrections, storage); Lotbook text+vision smokes;
workflow-builder e2e 7/7 on Postgres 16 + live `/api/ai/generate` streamed a
real workflow.

## Failing/partial components
- 9 pre-existing Grok scaffold test failures (grok-pwa/migration-plan) in
  both TanStack repos — platform chrome, identical on the untouched export.
- workflow-builder `pnpm check` lint tooling version-broken as shipped.
- No remote deployment yet (Vercel out of credits; Netlify/node-host chosen).

## Tests run
Per repo: typecheck, lint (0 errors), unit suites, production builds, browser
smokes, live LLM smokes, `/api/verify`, Playwright e2e (workflow-builder).

## Evidence
`evidence/2026-08-29_rebuild_and_gemini.md`

## Next stage
`system/` is the successor build on Dayna's chosen simple stack (Express +
Vite/React + pg + Gemini, .env-driven). Verified live: /api/verify 30/30 on
a fresh Postgres, real resale intake walked two chain steps in-scope, run
ledger visible, production build green. Next: port photo/document intake +
storage zones from the reference app into system/, wire real auth, deploy
system/ remote (any node host + Supabase Postgres — needs DB password from
Dayna), then merge Lotbook + workflow-builder capabilities behind it.
