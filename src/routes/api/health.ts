import { createFileRoute } from "@tanstack/react-router";
import { dbSource } from "@/lib/db";
import { llmAvailable, LLM_MODEL } from "@/lib/os/llm";
import { ROLES } from "@/lib/os/roles";
import { DEPLOY_ADAPTERS } from "@/lib/os/requirements";
import { ensureServerRuntime, serverFacts } from "@/lib/os/server-runtime";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        ensureServerRuntime();
        const facts = serverFacts();
        const body = {
          ok: true,
          status: "PARTIAL",
          db: facts.db,
          diskStorage: facts.diskStorage,
          dataDir: facts.dataDir,
          llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
          roles: ROLES.length,
          adapters: DEPLOY_ADAPTERS.map((a) => a.id),
          time: new Date().toISOString(),
          dbSource,
        };
        return new Response(JSON.stringify(body), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
