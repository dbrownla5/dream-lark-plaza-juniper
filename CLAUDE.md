# Dayna's MCP/LLM operating system

**Read `.claude/skills/dayna-os/SKILL.md` before doing anything.** It carries the
goal in Dayna's words, the rules for working with her, the live infrastructure, and
an honest status of what is and is not built. This file is only a pointer.

One product, three repos: this one (the system), `cinder-rose-velvet-field` (Lotbook
— photo intake / resale), `workflow-builder` (workflow engine). End state is one
remote dashboard she logs into.

Non-negotiables:

- Her written directives are the spec. Not a summary of prior chats, not your own
  description of what you built.
- Never build on assumed access — ask what she actually has.
- She does not use a terminal or the Google Cloud console. Never send her console or
  CLI homework.
- Evidence over claims. No mocks in production paths. Never localhost-as-production.
- Keep the 40 occupational roles distinct.
- Never print or commit secrets. `.env` is gitignored on purpose.
- Don't replace building with re-planning, and don't defend a build she has rejected.

**The directive documents currently in `packet/` and `attachments/` are broken
uploads** — Dayna has said so. Do not treat them as the spec. She is uploading clean
files; read those.

## Code layout

- `system/` — Express + Vite/React + Postgres + Gemini/Vertex, one `.env`. This is
  what is deployed to Cloud Run.
- root TanStack app — the older Grok-era implementation. Its `src/lib/os/photo.ts`,
  `documents.ts` and `storage.ts` are the photo/document pipeline to port from; no
  deployed server runs them today.
- Model client: `system/lib/llm.ts` (Vertex when `VERTEX_PROJECT` is set, else the
  Gemini key endpoint). Default model `gemini-3.6-flash`.
- Runtime invariants in `system/lib/runtime.ts`: every run exits through `recordRun`;
  failures salvage partial output into evidence; statuses are
  queued|running|waiting_approval|handed_off|blocked|done; the workflow cursor
  advances only from the current step's completing task; handoff side-tasks are
  prefixed `handoff:` and never move the chain.

## Verify

`npm run typecheck && npm run lint && npm test && npm run build`, then dev on :8080
and `/api/health`. Deployed checks go against the live Cloud Run URL — container
browsers cannot reach external URLs through the proxy, so use curl, not Playwright.
