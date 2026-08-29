# Build Ledger

Allowed status values: MISSING | SHELL | PARTIAL | WORKING | BLOCKED

Updated 2026-08-29 from executed evidence in a remote build container
(`evidence/2026-08-29_rebuild_and_gemini.md`). WORKING stays reserved for
the deployed Stage 15 gate; PARTIAL here means "integrated, executes, tests
pass in the dev container — not yet deployed to the remote production server."

| Requirement | Status | Integrated? | Executed? | Tests passed? | Evidence / commit / URL |
|---|---|---:|---:|---:|---|
| Remote production server | MISSING | No | No | No | Vercel out (no credits); Netlify free tier / node-host Dockerfile chosen, not yet deployed |
| Live web dashboard/app | PARTIAL | Yes | Yes | Yes | Boots on :8080; browser smoke both viewports; Run ledger/Outputs render real state |
| MCP server | PARTIAL | Yes | Yes | Yes | /api/verify mcp_init + 10 tools/call all pass |
| LLM runtime | PARTIAL | Yes | Yes | Yes | Rebuilt runtime.ts; live Gemini: /api/verify 46/46; live-smoke PASS |
| Guardrail/permission engine | PARTIAL | Yes | Yes | Yes | guardrails tests pass; verify guard_* checks pass; secret patterns incl. Gemini keys |
| 40 occupational agent contracts | PARTIAL | Yes | Yes | Yes | ROLES.length===40 verified; all 8 chains ran real occupations |
| Skills + qualification | PARTIAL | Yes | Yes | Yes | Per-user since migration 0005 (cross-tenant leak fixed); verify: qualified 39 |
| Agent runner + handoffs | PARTIAL | Yes | Yes | Yes | Rebuilt; 9 handoffs received prior output in live verify; idempotent chain cursor |
| Remote storage containers | PARTIAL | Yes | Yes | Yes | intake/originals/catalog/outputs zones written+read; write-once verified; local blobs, not yet remote |
| Photo intake/catalog pipeline | PARTIAL | Yes | Yes | Yes | Live vision analysis on batch; duplicates grouped; originals immutable |
| Document intake pipeline | PARTIAL | Yes | Yes | Yes | Live classification; LLM output validated before typed columns (crash class fixed) |
| Living context | PARTIAL | Yes | Yes | Yes | user words vs inference separated; per-role inference scoping added |
| Correction propagation | PARTIAL | Yes | Yes | Yes | verify context_correct + lineage checks pass |
| Approval/review states | PARTIAL | Yes | Yes | Yes | waiting_approval path exercised; blocked chains now render blocked (state machine fixed) |
| Failure/recovery | PARTIAL | Yes | Yes | Yes | Every run exits via recordRun (ledger+recovery point); failures salvage partial output |
| Cross-device/server persistence | PARTIAL | Yes | Yes | Partial | PGlite file persists across restarts; real Postgres pending Supabase deploy |
| End-to-end acceptance test | PARTIAL | Yes | Yes | Yes | /api/verify 46/46 live in dev container; Stage 15 deployed gate not yet run |
