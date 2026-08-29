import type { Sql } from "./db.ts";
import { newId } from "./ids.ts";
import { ROLES } from "./roles.ts";
import { llmAvailable, LLM_MODEL } from "./llm.ts";

export async function ensureWorkspace(sql: Sql, userId: string): Promise<void> {
  await sql.query(
    `insert into spend_limits (user_id, daily_cents) values ($1, 500) on conflict (user_id) do nothing`,
    [userId],
  );
  await seedSkills(sql, userId);
}

async function seedSkills(sql: Sql, userId: string): Promise<void> {
  const seeded = await sql.query<{ n: number }>(
    `select count(*)::int as n from skills where user_id = $1`,
    [userId],
  );
  if ((seeded[0]?.n ?? 0) > 0) return;
  for (const role of ROLES) {
    for (const name of role.requiredSkills) {
      await sql.query(
        `insert into skills (id, user_id, role_id, name, status, evidence)
         values ($1,$2,$3,$4,'candidate','seeded from TAB 04 required skills')
         on conflict (user_id, role_id, name) do nothing`,
        [newId("skill"), userId, role.id, name],
      );
    }
  }
}

export async function dailySpendCents(sql: Sql, userId: string): Promise<number> {
  const rows = await sql.query<{ total: number }>(
    `select coalesce(sum(cost_cents),0) as total from usage_events
     where user_id = $1 and created_at >= date_trunc('day', now())`,
    [userId],
  );
  return Number(rows[0]?.total ?? 0);
}

export async function spendCeiling(sql: Sql, userId: string): Promise<number> {
  const rows = await sql.query<{ daily_cents: number }>(
    `select daily_cents from spend_limits where user_id = $1`,
    [userId],
  );
  return Number(rows[0]?.daily_cents ?? 500);
}

export async function recordUsage(
  sql: Sql,
  opts: { userId: string; kind: string; costCents: number },
): Promise<void> {
  await sql.query(`insert into usage_events (id, user_id, kind, cost_cents) values ($1,$2,$3,$4)`, [
    newId("use"),
    opts.userId,
    opts.kind,
    opts.costCents,
  ]);
}

export async function audit(
  sql: Sql,
  opts: { userId: string; actor: string; action: string; target: string; detail: string },
): Promise<void> {
  // The append-only trail lives in task_events; system-level audit entries
  // attach to the task they concern so they are readable where the work is.
  await sql.query(
    `insert into task_events (id, task_id, user_id, kind, body) values ($1,$2,$3,$4,$5)`,
    [newId("evt"), opts.target, opts.userId, `audit:${opts.action}`, `${opts.actor} ${opts.detail}`],
  );
}

export function health(): Record<string, unknown> {
  return {
    ok: true,
    llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
    roles: ROLES.length,
    time: new Date().toISOString(),
  };
}
