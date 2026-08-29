# Dayna's System

The MCP/LLM operating system rebuilt on deliberately simple tools — the same
pattern as Dayna's own drafts: **Express + Vite/React + Postgres + Gemini**,
one `.env` file, no platform sandbox, no migration tooling, runs anywhere.

## Run it

```bash
cd system
npm install
cp .env.example .env     # put your GEMINI_API_KEY and DATABASE_URL in it
npm run dev              # http://localhost:3000
```

The database schema applies itself at startup (idempotent SQL). Without a
key the system boots and says so honestly — nothing is mocked.

## What's inside

- `server.ts` — Express server (Vite middleware in dev, static `dist/` in prod)
- `api.ts` — all HTTP routes: `/api/state`, `/api/intake`, `/api/words`,
  `/api/tasks`, `/api/workflows/:id/drive`, `/api/approvals/:id`,
  `/api/verify` (live acceptance surface), `/api/mcp` (JSON-RPC for AI clients)
- `lib/` — the domain core: the 40 occupational role contracts (TAB 04),
  guardrails, workflow chains, living context with correction lineage,
  per-user skills, the Gemini client, and the agent runtime whose ledger
  records **every** run durably (no call is ever erased; failures keep the
  model's partial output as salvage)
- `src/` — the dashboard: Today (speak → routed to a chain → first
  occupation runs now), Occupations, Work (chain paths + run-next-step),
  System (run ledger + living context)

## Deploy

Any Node host: `npm run build`, set `.env` values as host env vars, `npm start`.
Works on a $0 Netlify/Render/Fly-style host or a plain container. Supabase's
free Postgres is a fine `DATABASE_URL`.

## Still to port from the reference build

Photo/media intake pipeline, document intake pipeline, blob storage zones,
Better Auth sign-in (single-user until then), and the Lotbook +
workflow-builder merges. The reference implementation for all of it lives in
this repo's root app and the two sibling repos.
