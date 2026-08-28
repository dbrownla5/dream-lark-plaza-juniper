import type { Sql } from "@/lib/db";
import { newId } from "./ids.ts";
import { ROLES } from "./roles.ts";
import { dbSource } from "@/lib/db";
import { llmAvailable, LLM_MODEL } from "./llm.ts";

export async function ensureWorkspace(sql: Sql, userId: string): Promise<{ workspaceId: string }> {
  const existing = await sql.query<{ id: string }>(
    `select id from workspaces where user_id = $1`,
    [userId],
  );
  let workspaceId = existing[0]?.id;
  if (!workspaceId) {
    workspaceId = newId("ws");
    await sql.query(`insert into workspaces (id, user_id) values ($1,$2)`, [workspaceId, userId]);
  }
  const spend = await sql.query<{ user_id: string }>(`select user_id from spend_limits where user_id = $1`, [
    userId,
  ]);
  if (!spend[0]) {
    await sql.query(`insert into spend_limits (user_id, daily_cents) values ($1, 500)`, [userId]);
  }
  await seedSkills(sql);
  await writeHealth(sql, userId);
  return { workspaceId };
}

async function seedSkills(sql: Sql): Promise<void> {
  for (const role of ROLES) {
    for (const name of role.requiredSkills) {
      const id = `skill_${role.id}_${slug(name)}`.slice(0, 120);
      await sql.query(
        `insert into skills (id, role_id, name, status, evidence)
         values ($1,$2,$3,'candidate','seeded from TAB 04 required skills')
         on conflict (role_id, name) do nothing`,
        [id, role.id, name],
      );
    }
  }
}

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export async function writeHealth(sql: Sql, userId: string): Promise<void> {
  const payload = {
    status: "PARTIAL",
    db: dbSource,
    llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
    roles: 40,
    updatedAt: new Date().toISOString(),
    note: "WORKING is reserved for Stage 15. Components remain PARTIAL.",
  };
  await sql.query(
    `insert into system_health (id, user_id, payload_json)
     values ($1,$2,$3)
     on conflict (id) do update set user_id = excluded.user_id, payload_json = excluded.payload_json, updated_at = now()`,
    [`health:${userId}`, userId, JSON.stringify(payload)],
  );
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
  await sql.query(
    `insert into usage_events (id, user_id, kind, cost_cents) values ($1,$2,$3,$4)`,
    [newId("use"), opts.userId, opts.kind, opts.costCents],
  );
}

export async function audit(
  sql: Sql,
  opts: { userId: string; actor: string; action: string; target?: string; detail?: string },
): Promise<void> {
  await sql.query(
    `insert into audit_log (id, user_id, actor, action, target, detail) values ($1,$2,$3,$4,$5,$6)`,
    [newId("aud"), opts.userId, opts.actor, opts.action, opts.target ?? null, opts.detail ?? null],
  );
}
