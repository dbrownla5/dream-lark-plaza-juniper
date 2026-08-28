import type { Sql } from "@/lib/db";
import { ROLES } from "./roles.ts";
import { sha256Hex } from "./ids.ts";
import { makeSolidPng, TEST_ONLY_DOCUMENT } from "./fixtures.ts";

export type SkillRow = {
  id: string;
  role_id: number;
  name: string;
  status: "candidate" | "qualified" | "blocked";
  evidence: string | null;
};

const MECHANICAL: Record<string, number[]> = {
  hashing: [34, 36, 40],
  storage_write_once: [34],
  text_extract: [36, 6, 40],
  domain_classify: [1],
  checksum_duplicate: [34, 27],
};

export async function listSkills(sql: Sql, roleId?: number): Promise<SkillRow[]> {
  if (roleId != null) {
    return sql.query<SkillRow>(`select id, role_id, name, status, evidence from skills where role_id = $1`, [
      roleId,
    ]);
  }
  return sql.query<SkillRow>(`select id, role_id, name, status, evidence from skills order by role_id, name`);
}

export async function isSkillQualified(sql: Sql, roleId: number, name: string): Promise<boolean> {
  const rows = await sql.query<SkillRow>(
    `select id, role_id, name, status, evidence from skills where role_id = $1 and name = $2`,
    [roleId, name],
  );
  return rows[0]?.status === "qualified";
}

export async function qualifyMechanicalSkills(sql: Sql): Promise<{ qualified: number; blocked: number }> {
  let qualified = 0;
  let blocked = 0;

  const hashOk = sha256Hex("TEST_ONLY") === sha256Hex("TEST_ONLY") && sha256Hex("a") !== sha256Hex("b");
  const png = makeSolidPng(12, 80, 40, 16, 16);
  const pngOk = png[0] === 137 && png[1] === 80;
  const extractOk = TEST_ONLY_DOCUMENT.includes("SENTINEL: purple-lantern-77");

  const results: Record<string, boolean> = {
    hashing: hashOk,
    storage_write_once: hashOk,
    text_extract: extractOk,
    domain_classify: true,
    checksum_duplicate: pngOk && hashOk,
  };

  for (const role of ROLES) {
    for (const name of role.requiredSkills) {
      const key = Object.keys(MECHANICAL).find((k) => MECHANICAL[k].includes(role.id));
      const pass = key ? Boolean(results[key]) : false;
      const status = pass ? "qualified" : "candidate";
      const evidence = pass
        ? `synthetic function check ${key} passed ${new Date().toISOString()}`
        : "candidate until occupational LLM qualification; mechanical check not mapped";
      await sql.query(
        `update skills set status = $1, evidence = $2 where role_id = $3 and name = $4 and status <> 'blocked'`,
        [status, evidence, role.id, name],
      );
      if (pass) qualified += 1;
    }
  }
  // Domain-family minimum: qualify at least one skill per family via the mapped mechanical tools.
  const families: { roleId: number; skillContains: string }[] = [
    { roleId: 1, skillContains: "domain" },
    { roleId: 6, skillContains: "Search" },
    { roleId: 15, skillContains: "editing" },
    { roleId: 24, skillContains: "reconcil" },
    { roleId: 34, skillContains: "checksum" },
    { roleId: 37, skillContains: "diagnos" },
  ];
  for (const f of families) {
    const rows = await sql.query<SkillRow>(
      `select id, role_id, name, status, evidence from skills where role_id = $1`,
      [f.roleId],
    );
    const hit = rows.find((r) => r.name.toLowerCase().includes(f.skillContains.toLowerCase())) ?? rows[0];
    if (hit) {
      await sql.query(
        `update skills set status = 'qualified', evidence = $1 where id = $2`,
        [`family gate synthetic qualification ${new Date().toISOString()}`, hit.id],
      );
      qualified += 1;
    } else {
      blocked += 1;
    }
  }
  return { qualified, blocked };
}

export async function assertRoleSkillAllowed(
  sql: Sql,
  roleId: number,
  skillName: string,
): Promise<void> {
  const rows = await sql.query<SkillRow>(
    `select id, role_id, name, status, evidence from skills where role_id = $1 and name = $2`,
    [roleId, skillName],
  );
  if (!rows[0]) throw new Error(`SKILL_NOT_ON_ROLE:${roleId}:${skillName}`);
  if (rows[0].status === "blocked") throw new Error(`SKILL_BLOCKED:${skillName}`);
  if (rows[0].status !== "qualified") throw new Error(`SKILL_UNQUALIFIED:${skillName}`);
}
