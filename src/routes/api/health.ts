import { createFileRoute } from "@tanstack/react-router";
import { dbSource } from "@/lib/db";
import { llmAvailable, LLM_MODEL } from "@/lib/os/llm";
import { ROLES } from "@/lib/os/roles";
import { DEPLOY_ADAPTERS } from "@/lib/os/requirements";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const body = {
          ok: true,
          status: "PARTIAL",
          db: dbSource,
          llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
          roles: ROLES.length,
          adapters: DEPLOY_ADAPTERS.map((a) => a.id),
          time: new Date().toISOString(),
        };
        return new Response(JSON.stringify(body), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
