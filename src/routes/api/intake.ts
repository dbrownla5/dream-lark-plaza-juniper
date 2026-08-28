import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { userIdFromRequest } from "@/lib/os/request-user";
import { ensureWorkspace } from "@/lib/os/workspace";
import { ingestPhotoBatch } from "@/lib/os/photo";
import { ingestDocument } from "@/lib/os/documents";
import { writeContext } from "@/lib/os/context";
import { createTask, runOccupation } from "@/lib/os/runtime";
import { classifyIntakeDomain } from "@/lib/os/workflows";

export const Route = createFileRoute("/api/intake")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const userId = await userIdFromRequest(request);
          const sql = await getSql();
          await ensureWorkspace(sql, userId);
          const form = await request.formData();
          const words = String(form.get("words") ?? "").trim();
          const sourceType = String(form.get("source_type") ?? "web_app");
          const isTestOnly = String(form.get("is_test_only") ?? "") === "1";
          const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

          const photos: { filename: string; mime: string; bytes: Uint8Array }[] = [];
          const docs: { filename: string; mime: string; bytes: Uint8Array }[] = [];
          for (const file of files) {
            const bytes = new Uint8Array(await file.arrayBuffer());
            const mime = file.type || "application/octet-stream";
            if (mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic)$/i.test(file.name)) {
              photos.push({ filename: file.name, mime, bytes });
            } else {
              docs.push({ filename: file.name, mime, bytes });
            }
          }

          const result: Record<string, unknown> = { ok: true, userId };

          if (words) {
            const rec = await writeContext(sql, {
              userId,
              kind: "processing_aloud",
              body: words,
              author: "user",
              source: `intake:${sourceType}`,
            });
            await writeContext(sql, {
              userId,
              kind: "user_statement",
              body: words,
              author: "user",
              source: `intake:${sourceType}`,
              lineageId: rec.lineage_id,
            });
            const place = String(form.get("place_on_desk") ?? "") === "1";
            if (place) {
              const domain = classifyIntakeDomain(words);
              const task = await createTask(sql, {
                userId,
                roleId: domain.roleId,
                title: "Desk work",
                requestStatement: words,
                isTestOnly,
              });
              const run = await runOccupation(sql, { userId, taskId: task.id, action: "ANALYZE" });
              result.words = {
                contextId: rec.id,
                listened: false,
                taskId: run.task.id,
                status: run.task.status,
                blockedReason: run.blockedReason,
                domain,
              };
            } else {
              result.words = { contextId: rec.id, listened: true };
            }
          }

          if (photos.length) {
            result.photos = await ingestPhotoBatch(sql, {
              userId,
              files: photos,
              sourceType,
              isTestOnly,
            });
          }
          if (docs.length) {
            result.documents = [];
            for (const d of docs) {
              (result.documents as unknown[]).push(
                await ingestDocument(sql, {
                  userId,
                  filename: d.filename,
                  mime: d.mime,
                  bytes: d.bytes,
                  isTestOnly,
                }),
              );
            }
          }

          const accept = request.headers.get("accept") ?? "";
          const wantsHtml = accept.includes("text/html") && !accept.includes("application/json");
          if (wantsHtml) {
            const loc = photos.length ? "/media" : docs.length ? "/documents" : "/intake";
            return new Response(null, { status: 303, headers: { Location: loc } });
          }
          return new Response(JSON.stringify(result), {
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          const status = (err as { status?: number }).status === 401 ? 401 : 500;
          const message = err instanceof Error ? err.message : "intake failed";
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
