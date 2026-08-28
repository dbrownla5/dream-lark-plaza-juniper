import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { userIdFromRequest } from "@/lib/os/request-user";
import { ensureWorkspace } from "@/lib/os/workspace";
import { ingestOriginal, getObjectBytes, tryMutateOriginal, zoneCensus } from "@/lib/os/storage";
import { sha256Hex } from "@/lib/os/ids";
import { makeSolidPng, TEST_ONLY_DOCUMENT } from "@/lib/os/fixtures";
import { ingestDocument } from "@/lib/os/documents";
import { drainIntakeQueue } from "@/lib/os/queue";
import { llmAvailable, LLM_MODEL } from "@/lib/os/llm";
import { ROLES } from "@/lib/os/roles";

export const Route = createFileRoute("/api/prove")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const checks: { id: string; pass: boolean; detail: string }[] = [];
        const add = (id: string, pass: boolean, detail: string) => checks.push({ id, pass, detail });
        try {
          const userId = await userIdFromRequest(request);
          const sql = await getSql();
          await ensureWorkspace(sql, userId);
          add("roles", ROLES.length === 40, `${ROLES.length} occupations loaded`);
          add("llm", llmAvailable(), llmAvailable() ? LLM_MODEL : "UNAVAILABLE");

          const png = makeSolidPng(40, 90, 50, 16, 16);
          const stored = await ingestOriginal(sql, {
            userId,
            bytes: png,
            mime: "image/png",
            originalFilename: "TEST_ONLY_prove.png",
          });
          const back = await getObjectBytes(sql, userId, stored.original.id);
          add("intake_zone", stored.intake.zone === "intake", stored.intake.object_key);
          add("original_zone", stored.original.zone === "originals" && stored.original.immutable === 1, stored.original.object_key);
          add("checksum", sha256Hex(back) === stored.original.checksum_sha256, stored.original.checksum_sha256);
          let immutable = false;
          try {
            await tryMutateOriginal(sql, userId, stored.original.id, makeSolidPng(1, 1, 1, 8, 8));
          } catch (e) {
            immutable = e instanceof Error && e.message === "ORIGINAL_IMMUTABLE";
          }
          add("write_once", immutable, "original overwrite blocked");

          const doc = await ingestDocument(sql, {
            userId,
            filename: "TEST_ONLY_quokka.txt",
            mime: "text/plain",
            bytes: new Uint8Array(Buffer.from(TEST_ONLY_DOCUMENT)),
            isTestOnly: true,
          });
          add("document", Boolean(doc.id) && Boolean(doc.extracted_text?.includes("SENTINEL")), doc.id);
          await drainIntakeQueue(sql, { userId, limit: 4 });

          const wf = await sql.query<{ id: string; current_step: number; status: string; chain_id: string }>(
            `select id, current_step, status, chain_id from workflow_instances where user_id = $1 and subject_id = $2 order by created_at desc limit 1`,
            [userId, doc.id],
          );
          add("workflow", Boolean(wf[0]), wf[0] ? `${wf[0].chain_id} ${wf[0].status} step ${wf[0].current_step}` : "missing");

          const tasks = wf[0]
            ? await sql.query<{
                id: string;
                role_id: number;
                status: string;
                package_id: string | null;
                input_json: string | null;
                output_json: string | null;
                parent_task_id: string | null;
              }>(
              `select id, role_id, status, package_id, input_json, output_json, parent_task_id
               from tasks where user_id = $1 and workflow_id = $2 order by created_at`,
              [userId, wf[0].id],
            )
            : [];
          add("first_has_package", Boolean(tasks[0]?.package_id), tasks[0]?.package_id ?? "none");
          add(
            "first_holds_text",
            Boolean(tasks[0]?.input_json && tasks[0].input_json.includes("SENTINEL")),
            tasks[0] ? `role ${tasks[0].role_id} ${tasks[0].status}` : "none",
          );
          add("two_occupations", tasks.length >= 2, `${tasks.length} tasks`);
          add(
            "second_got_prior",
            Boolean(tasks[1]?.input_json && (tasks[1].input_json.includes("fromTaskId") || tasks[1].input_json.includes("fromRoleId"))),
            tasks[1] ? `role ${tasks[1].role_id} ${tasks[1].status}` : "no second",
          );
          add(
            "connected_done",
            tasks.filter((t) => t.status === "done").length >= 1,
            tasks.map((t) => `${t.role_id}:${t.status}`).join(" → ") || "none",
          );

          const pkg = tasks[0]?.package_id
            ? await sql.query<{ payload_json: string | null }>(
                `select payload_json from work_packages where id = $1 and user_id = $2`,
                [tasks[0].package_id, userId],
              )
            : [];
          add(
            "package_history",
            Boolean(pkg[0]?.payload_json && pkg[0].payload_json.includes("history") && pkg[0].payload_json.includes("taskId")),
            pkg[0]?.payload_json ? "history present" : "no history",
          );

          const zones = await zoneCensus(sql, userId);
          add("outputs_zone", (zones.find((z) => z.zone === "outputs")?.count ?? 0) >= 1, String(zones.find((z) => z.zone === "outputs")?.count ?? 0));

          const failed = checks.filter((c) => !c.pass).length;
          return new Response(
            JSON.stringify({
              ok: failed === 0,
              passed: checks.length - failed,
              failed,
              checks,
              zones,
              path: tasks.map((t) => ({ roleId: t.role_id, status: t.status, parent: t.parent_task_id })),
              output: tasks.find((t) => t.output_json)?.output_json ?? null,
            }),
            { headers: { "content-type": "application/json" } },
          );
        } catch (err) {
          add("crash", false, err instanceof Error ? err.message : "prove failed");
          return new Response(JSON.stringify({ ok: false, passed: 0, failed: checks.length, checks }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
