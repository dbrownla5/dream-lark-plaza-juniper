import type { Sql } from "@/lib/db";
import { newId } from "./ids.ts";

export type PackagePayload = {
  documentId?: string | null;
  blobId?: string | null;
  filename?: string | null;
  checksum?: string | null;
  extractedText?: string | null;
  classification?: string | null;
  mediaBatchId?: string | null;
  history: {
    roleId: number;
    taskId: string;
    stepName: string | null;
    interpretation: string | null;
    output: unknown;
  }[];
};

export type WorkPackage = {
  id: string;
  user_id: string;
  title: string;
  objective: string;
  status: string;
  workflow_id: string | null;
  payload: PackagePayload;
};

function emptyPayload(): PackagePayload {
  return { history: [] };
}

function parsePayload(raw: string | null): PackagePayload {
  if (!raw) return emptyPayload();
  try {
    const parsed = JSON.parse(raw) as PackagePayload;
    if (!parsed.history) parsed.history = [];
    return parsed;
  } catch {
    return emptyPayload();
  }
}

export async function createWorkPackage(
  sql: Sql,
  opts: {
    userId: string;
    title: string;
    objective: string;
    payload?: Partial<PackagePayload>;
  },
): Promise<WorkPackage> {
  const id = newId("pkg");
  const payload: PackagePayload = { ...emptyPayload(), ...opts.payload, history: opts.payload?.history ?? [] };
  await sql.query(
    `insert into work_packages (id, user_id, title, objective, status, payload_json)
     values ($1,$2,$3,$4,'open',$5)`,
    [id, opts.userId, opts.title, opts.objective, JSON.stringify(payload)],
  );
  return { id, user_id: opts.userId, title: opts.title, objective: opts.objective, status: "open", workflow_id: null, payload };
}

export async function bindPackageWorkflow(sql: Sql, userId: string, packageId: string, workflowId: string): Promise<void> {
  await sql.query(`update work_packages set workflow_id = $1 where id = $2 and user_id = $3`, [
    workflowId,
    packageId,
    userId,
  ]);
}

export async function loadPackage(sql: Sql, userId: string, id: string): Promise<WorkPackage | null> {
  const rows = await sql.query<{
    id: string;
    user_id: string;
    title: string;
    objective: string;
    status: string;
    workflow_id: string | null;
    payload_json: string | null;
  }>(
    `select id, user_id, title, objective, status, workflow_id, payload_json from work_packages where id = $1 and user_id = $2`,
    [id, userId],
  );
  if (!rows[0]) return null;
  return { ...rows[0], payload: parsePayload(rows[0].payload_json) };
}

export async function appendPackageHistory(
  sql: Sql,
  opts: {
    userId: string;
    packageId: string;
    roleId: number;
    taskId: string;
    stepName: string | null;
    interpretation: string | null;
    output: unknown;
  },
): Promise<WorkPackage | null> {
  const pkg = await loadPackage(sql, opts.userId, opts.packageId);
  if (!pkg) return null;
  pkg.payload.history.push({
    roleId: opts.roleId,
    taskId: opts.taskId,
    stepName: opts.stepName,
    interpretation: opts.interpretation,
    output: opts.output,
  });
  await sql.query(`update work_packages set payload_json = $1 where id = $2 and user_id = $3`, [
    JSON.stringify(pkg.payload),
    pkg.id,
    opts.userId,
  ]);
  return pkg;
}

export function packagePrompt(pkg: WorkPackage): string {
  const p = pkg.payload;
  const lines = [
    `Work package ${pkg.id}: ${pkg.title}`,
    `Objective: ${pkg.objective}`,
    p.filename ? `Held original: ${p.filename} checksum=${p.checksum ?? "none"} classification=${p.classification ?? "none"}` : "",
    p.extractedText
      ? `Extracted text from the original (this is evidence, not your words):\n${p.extractedText.slice(0, 6000)}`
      : p.mediaBatchId
        ? `Media batch ${p.mediaBatchId} is in originals. Do not invent identity from a filename.`
        : "",
  ];
  if (p.history.length) {
    lines.push("Prior occupations on this same package (do not restart the lineage):");
    for (const h of p.history) {
      lines.push(
        `- role ${h.roleId}${h.stepName ? ` ${h.stepName}` : ""}: ${h.interpretation ?? ""}\n  output: ${JSON.stringify(h.output).slice(0, 1500)}`,
      );
    }
  } else {
    lines.push("No prior occupation has written on this package yet. You are first.");
  }
  return lines.filter(Boolean).join("\n");
}
