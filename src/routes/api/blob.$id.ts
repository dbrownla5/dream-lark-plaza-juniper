import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { userIdFromRequest } from "@/lib/os/request-user";
import { getObject, getObjectBytes } from "@/lib/os/storage";

export const Route = createFileRoute("/api/blob/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const userId = await userIdFromRequest(request);
          const sql = await getSql();
          const meta = await getObject(sql, userId, params.id);
          if (!meta) return new Response("not found", { status: 404 });
          const bytes = await getObjectBytes(sql, userId, params.id);
          return new Response(Buffer.from(bytes), {
            headers: {
              "content-type": meta.mime || "application/octet-stream",
              "content-disposition": `inline; filename="${meta.original_filename ?? meta.id}"`,
              "x-checksum-sha256": meta.checksum_sha256,
              "cache-control": "private, max-age=0, must-revalidate",
            },
          });
        } catch (err) {
          const status = (err as { status?: number }).status === 401 ? 401 : 500;
          return new Response(err instanceof Error ? err.message : "error", { status });
        }
      },
    },
  },
});
