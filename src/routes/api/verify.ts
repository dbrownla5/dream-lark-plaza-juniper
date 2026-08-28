import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { userIdFromRequest } from "@/lib/os/request-user";
import { runDeskVerify } from "@/lib/os/verify";

export const Route = createFileRoute("/api/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = await userIdFromRequest(request);
          const sql = await getSql();
          const result = await runDeskVerify(sql, userId);
          return new Response(JSON.stringify(result), {
            status: result.ok ? 200 : 500,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ ok: false, launch: "NOT LAUNCHABLE", error: err instanceof Error ? err.message : "verify failed" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
