import type { Sql } from "@/lib/db";
import { newId } from "./ids.ts";

export const CONTEXT_KINDS = [
  "user_statement",
  "verified_fact",
  "external_evidence",
  "agent_inference",
  "calculation",
  "preference",
  "decision",
  "temporary_idea",
  "correction",
  "superseded_state",
  "unfinished_work",
  "processing_aloud",
] as const;

export type ContextKind = (typeof CONTEXT_KINDS)[number];

export type LivingRecord = {
  id: string;
  user_id: string;
  kind: ContextKind;
  body: string;
  author: string;
  source: string | null;
  confidence: number | null;
  scope: string | null;
  permissions: string | null;
  project_id: string | null;
  matter_id: string | null;
  supersedes_id: string | null;
  superseded_by: string | null;
  lineage_id: string;
  version_n: number;
  artifact_id: string | null;
  created_at: string;
};

const SELECT = `id, user_id, kind, body, author, source, confidence, scope, permissions,
  project_id, matter_id, supersedes_id, superseded_by, lineage_id, version_n, artifact_id,
  created_at::text as created_at`;

export async function writeContext(
  sql: Sql,
  opts: {
    userId: string;
    kind: ContextKind;
    body: string;
    author: string;
    source?: string | null;
    confidence?: number | null;
    scope?: string | null;
    permissions?: string | null;
    projectId?: string | null;
    matterId?: string | null;
    lineageId?: string | null;
    artifactId?: string | null;
  },
): Promise<LivingRecord> {
  if (!(CONTEXT_KINDS as readonly string[]).includes(opts.kind)) {
    throw new Error(`UNKNOWN_CONTEXT_KIND:${opts.kind}`);
  }
  if (opts.kind === "user_statement" && opts.author !== "dayna" && opts.author !== "user") {
    throw new Error("USER_STATEMENT_AUTHOR_MUST_BE_USER");
  }
  if (opts.kind === "agent_inference" && (opts.author === "dayna" || opts.author === "user")) {
    throw new Error("INFERENCE_CANNOT_BE_ATTRIBUTED_TO_USER");
  }
  const id = newId("ctx");
  const lineageId = opts.lineageId ?? newId("lin");
  await sql.query(
    `insert into living_context
      (id, user_id, kind, body, author, source, confidence, scope, permissions, project_id, matter_id, lineage_id, artifact_id)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [
      id,
      opts.userId,
      opts.kind,
      opts.body,
      opts.author,
      opts.source ?? null,
      opts.confidence ?? null,
      opts.scope ?? opts.kind,
      opts.permissions ?? "owner",
      opts.projectId ?? null,
      opts.matterId ?? null,
      lineageId,
      opts.artifactId ?? null,
    ],
  );
  const row = await getContext(sql, opts.userId, id);
  if (!row) throw new Error("CONTEXT_WRITE_FAILED");
  return row;
}

export async function getContext(sql: Sql, userId: string, id: string): Promise<LivingRecord | null> {
  const rows = await sql.query<LivingRecord>(
    `select ${SELECT} from living_context where id = $1 and user_id = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function currentOfLineage(
  sql: Sql,
  userId: string,
  lineageId: string,
): Promise<LivingRecord | null> {
  const rows = await sql.query<LivingRecord>(
    `select ${SELECT} from living_context
     where user_id = $1 and lineage_id = $2 and superseded_by is null
     order by version_n desc limit 1`,
    [userId, lineageId],
  );
  return rows[0] ?? null;
}

export async function correctContext(
  sql: Sql,
  opts: {
    userId: string;
    supersedesId: string;
    body: string;
    author: string;
  },
): Promise<LivingRecord> {
  const prior = await getContext(sql, opts.userId, opts.supersedesId);
  if (!prior) throw new Error("CONTEXT_NOT_FOUND");
  const id = newId("ctx");
  const version = prior.version_n + 1;
  await sql.query(
    `insert into living_context
      (id, user_id, kind, body, author, source, confidence, scope, permissions, project_id, matter_id,
       supersedes_id, lineage_id, version_n, artifact_id)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      id,
      opts.userId,
      "correction",
      opts.body,
      opts.author,
      "user_correction",
      1,
      prior.scope,
      prior.permissions,
      prior.project_id,
      prior.matter_id,
      prior.id,
      prior.lineage_id,
      version,
      prior.artifact_id,
    ],
  );
  await sql.query(
    `update living_context set superseded_by = $1, kind = case when id = $2 then 'superseded_state' else kind end
     where user_id = $3 and id = $2`,
    [id, prior.id, opts.userId],
  );
  const row = await getContext(sql, opts.userId, id);
  if (!row) throw new Error("CORRECTION_WRITE_FAILED");
  return row;
}

export async function retrieveForTask(
  sql: Sql,
  opts: {
    userId: string;
    roleId: number;
    projectId?: string | null;
    limit?: number;
  },
): Promise<LivingRecord[]> {
  const limit = opts.limit ?? 40;
  // Dayna's words, corrections, facts and decisions are shared context; other
  // roles' raw inferences are not — each occupation sees only its own.
  return sql.query<LivingRecord>(
    `select ${SELECT} from living_context
     where user_id = $1
       and superseded_by is null
       and (
         source = 'voice_pillar'
         or permissions is null
         or permissions in ('owner','role','public')
       )
       and ($2::text is null or project_id is null or project_id = $2)
       and (kind <> 'agent_inference' or author = $3)
     order by case when source = 'voice_pillar' then 0 else 1 end, created_at desc
     limit $4`,
    [opts.userId, opts.projectId ?? null, `role:${opts.roleId}`, limit],
  );
}

export async function listVoicePillars(sql: Sql, userId: string): Promise<LivingRecord[]> {
  return sql.query<LivingRecord>(
    `select ${SELECT} from living_context
     where user_id = $1 and source = 'voice_pillar' and superseded_by is null
     order by scope, created_at`,
    [userId],
  );
}

export async function listContext(sql: Sql, userId: string, limit = 80): Promise<LivingRecord[]> {
  return sql.query<LivingRecord>(
    `select ${SELECT} from living_context where user_id = $1 order by created_at desc limit $2`,
    [userId, limit],
  );
}

export async function refineArtifact(
  sql: Sql,
  opts: {
    userId: string;
    artifactId: string;
    body: string;
    origin: "user" | "agent_inference";
    startOver?: boolean;
  },
): Promise<{ artifactId: string; lineageId: string; version: number }> {
  const existing = await sql.query<{
    id: string;
    lineage_id: string;
    current_version: number;
  }>(`select id, lineage_id, current_version from artifacts where id = $1 and user_id = $2`, [
    opts.artifactId,
    opts.userId,
  ]);
  if (!existing[0]) throw new Error("ARTIFACT_NOT_FOUND");
  if (opts.startOver) {
    const lineageId = newId("lin");
    const artifactId = newId("art");
    await sql.query(
      `insert into artifacts (id, user_id, title, kind, lineage_id, current_version)
       values ($1,$2,$3,$4,$5,1)`,
      [artifactId, opts.userId, "new direction", "writing", lineageId],
    );
    await sql.query(
      `insert into artifact_versions (id, artifact_id, user_id, version_n, body, origin)
       values ($1,$2,$3,1,$4,$5)`,
      [newId("ver"), artifactId, opts.userId, opts.body, opts.origin],
    );
    return { artifactId, lineageId, version: 1 };
  }
  const version = existing[0].current_version + 1;
  await sql.query(
    `insert into artifact_versions (id, artifact_id, user_id, version_n, body, origin)
     values ($1,$2,$3,$4,$5,$6)`,
    [newId("ver"), existing[0].id, opts.userId, version, opts.body, opts.origin],
  );
  await sql.query(
    `update artifacts set current_version = $1 where id = $2 and user_id = $3`,
    [version, existing[0].id, opts.userId],
  );
  return { artifactId: existing[0].id, lineageId: existing[0].lineage_id, version };
}

export async function createArtifact(
  sql: Sql,
  opts: { userId: string; title: string; kind: string; body: string; origin: "user" | "agent_inference" },
): Promise<{ artifactId: string; lineageId: string }> {
  const artifactId = newId("art");
  const lineageId = newId("lin");
  await sql.query(
    `insert into artifacts (id, user_id, title, kind, lineage_id, current_version)
     values ($1,$2,$3,$4,$5,1)`,
    [artifactId, opts.userId, opts.title, opts.kind, lineageId],
  );
  await sql.query(
    `insert into artifact_versions (id, artifact_id, user_id, version_n, body, origin)
     values ($1,$2,$3,1,$4,$5)`,
    [newId("ver"), artifactId, opts.userId, opts.body, opts.origin],
  );
  return { artifactId, lineageId };
}
