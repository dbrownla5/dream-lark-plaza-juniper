import type { Sql } from "@/lib/db";
import { newId } from "./ids.ts";
import { driveUntilBlocked } from "./runtime.ts";

export type IntakeJob = {
  id: string;
  user_id: string;
  kind: string;
  status: string;
  payload_json: string;
  error: string | null;
  result_json: string | null;
};

export async function enqueueJob(
  sql: Sql,
  opts: { userId: string; kind: string; payload: unknown },
): Promise<IntakeJob> {
  const id = newId("job");
  await sql.query(
    `insert into intake_jobs (id, user_id, kind, status, payload_json) values ($1,$2,$3,'queued',$4)`,
    [id, opts.userId, opts.kind, JSON.stringify(opts.payload)],
  );
  const rows = await sql.query<IntakeJob>(
    `select id, user_id, kind, status, payload_json, error, result_json from intake_jobs where id = $1`,
    [id],
  );
  return rows[0];
}

export async function listJobs(sql: Sql, userId: string, limit = 20): Promise<IntakeJob[]> {
  return sql.query<IntakeJob>(
    `select id, user_id, kind, status, payload_json, error, result_json from intake_jobs
     where user_id = $1 order by created_at desc limit $2`,
    [userId, limit],
  );
}

export async function drainIntakeQueue(
  sql: Sql,
  opts?: { userId?: string; limit?: number },
): Promise<{ ran: number; failed: number }> {
  const limit = opts?.limit ?? 4;
  const rows = opts?.userId
    ? await sql.query<IntakeJob>(
        `select id, user_id, kind, status, payload_json, error, result_json from intake_jobs
         where status = 'queued' and user_id = $1 order by created_at limit $2`,
        [opts.userId, limit],
      )
    : await sql.query<IntakeJob>(
        `select id, user_id, kind, status, payload_json, error, result_json from intake_jobs
         where status = 'queued' order by created_at limit $1`,
        [limit],
      );
  let ran = 0;
  let failed = 0;
  for (const job of rows) {
    await sql.query(`update intake_jobs set status = 'running', updated_at = now() where id = $1`, [job.id]);
    try {
      const payload = JSON.parse(job.payload_json) as { workflowId?: string };
      let result: unknown = { ok: true };
      if (job.kind === "drive_workflow" && payload.workflowId) {
        result = await driveUntilBlocked(sql, job.user_id, payload.workflowId, 8);
      }
      await sql.query(
        `update intake_jobs set status = 'done', result_json = $1, updated_at = now() where id = $2`,
        [JSON.stringify(result), job.id],
      );
      ran += 1;
    } catch (err) {
      failed += 1;
      await sql.query(
        `update intake_jobs set status = 'failed', error = $1, updated_at = now() where id = $2`,
        [err instanceof Error ? err.message : "job failed", job.id],
      );
    }
  }
  return { ran, failed };
}

let workerStarted = false;

export function startQueueWorker(getSql: () => Promise<Sql>): void {
  if (workerStarted) return;
  workerStarted = true;
  const tick = async () => {
    try {
      const sql = await getSql();
      await drainIntakeQueue(sql, { limit: 2 });
    } catch (err) {
      console.error("[queue]", err instanceof Error ? err.message : err);
    }
  };
  setInterval(() => {
    void tick();
  }, 4000);
  void tick();
}
