import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { DEV_USER_ID, getSessionUser } from "@/lib/auth/verify.server";
import { authenticateMcp, handleJsonRpc, mcpUnauthorized, type JsonRpcReq } from "@/lib/os/mcp";
import { ensureWorkspace } from "@/lib/os/workspace";

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as JsonRpcReq;
          const authz = request.headers.get("authorization") ?? "";
          const bearer = authz.toLowerCase().startsWith("bearer ") ? authz.slice(7).trim() : null;
          const session = await getSessionUser(bearer ?? undefined);
          const sql = await getSql();
          const authOff = import.meta.env.VITE_AUTH_ENABLED === "false";
          const userId = await authenticateMcp(sql, {
            userIdFromSession: session?.id ?? (authOff ? DEV_USER_ID : null),
            token: bearer,
          });
          await ensureWorkspace(sql, userId);
          const res = await handleJsonRpc(sql, userId, body);
          return new Response(JSON.stringify(res), {
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          const status = (err as { status?: number }).status === 401 ? 401 : 500;
          if (status === 401) {
            return new Response(JSON.stringify(mcpUnauthorized()), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }
          const message = err instanceof Error ? err.message : "mcp failed";
          return new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32603, message } }), {
            status,
            headers: { "content-type": "application/json" },
          });
        }
      },
      GET: async () => {
        return new Response(
          JSON.stringify({
            name: "dayna-os-mcp",
            transport: "jsonrpc-http",
            path: "/api/mcp",
            status: "PARTIAL",
          }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
