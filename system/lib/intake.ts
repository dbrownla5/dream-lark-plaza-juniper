/**
 * What happens when Dayna drops something in.
 *
 * Order matters and is not negotiable:
 *   1. checksum the bytes
 *   2. store the original durably and confirm the store accepted it
 *   3. only then write the catalog row
 *   4. only then analyze
 *
 * If step 2 fails, the row records a failure. Nothing downstream is allowed to
 * report success for a file that was not preserved, and the source is never
 * treated as safe to clear.
 */
import type { Sql } from "./db.ts";
import { newId, sha256Hex } from "./ids.ts";
import { putObject, type Zone } from "./storage.ts";
import { invokeVision } from "./llm.ts";
import { writeContext } from "./context.ts";
import { recordUsage } from "./workspace.ts";
import { startChain } from "./runtime.ts";

export type FileRow = {
  id: string;
  user_id: string;
  batch_id: string | null;
  kind: string;
  original_name: string;
  mime: string;
  byte_size: number;
  checksum_sha256: string;
  zone: string;
  uri: string;
  working_name: string | null;
  status: string;
  analysis_json: string | null;
  extracted_text: string | null;
  uncertainty: string | null;
  failure_reason: string | null;
  workflow_id: string | null;
  created_at: string;
};

const FILE_SELECT = `id, user_id, batch_id, kind, original_name, mime, byte_size,
  checksum_sha256, zone, uri, working_name, status, analysis_json, extracted_text,
  uncertainty, failure_reason, workflow_id, created_at::text as created_at`;

export function kindForMime(mime: string, name: string): "image" | "document" | "other" {
  if (mime.startsWith("image/")) return "image";
  if (
    mime.startsWith("text/") ||
    mime === "application/pdf" ||
    /\.(pdf|txt|md|csv|docx?|rtf)$/i.test(name)
  ) {
    return "document";
  }
  return "other";
}

function extensionOf(name: string): string {
  const m = /\.[A-Za-z0-9]{1,8}$/.exec(name);
  return m ? m[0].toLowerCase() : "";
}

export async function createBatch(
  sql: Sql,
  opts: { userId: string; label: string; kind?: string; note?: string },
): Promise<{ id: string; label: string }> {
  const id = newId("batch");
  await sql.query(
    `insert into batches (id, user_id, label, kind, note) values ($1,$2,$3,$4,$5)`,
    [id, opts.userId, opts.label, opts.kind ?? "photo", opts.note ?? null],
  );
  return { id, label: opts.label };
}

/**
 * Preserve one file. Returns the catalog row in whatever state is TRUE —
 * 'preserved' or 'failed'. Never throws for storage failure; the row is the
 * honest record.
 */
export async function preserveFile(
  sql: Sql,
  opts: {
    userId: string;
    batchId: string | null;
    originalName: string;
    mime: string;
    bytes: Buffer;
  },
): Promise<{ file: FileRow; duplicateOf: string | null; backend: string }> {
  const checksum = sha256Hex(opts.bytes);
  const kind = kindForMime(opts.mime, opts.originalName);

  // Same bytes already in the system: record it, don't store twice, and say so.
  const dupes = await sql.query<{ id: string; uri: string; zone: string }>(
    `select id, uri, zone from files where user_id = $1 and checksum_sha256 = $2 limit 1`,
    [opts.userId, checksum],
  );
  const duplicateOf = dupes[0]?.id ?? null;

  const id = newId("file");
  const zone: Zone = "originals";
  const now = new Date();
  const key =
    `${opts.userId}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/` +
    `${id}${extensionOf(opts.originalName)}`;

  let uri: string;
  let backend: string;
  let status = "preserved";
  let failure: string | null = null;

  if (duplicateOf) {
    uri = dupes[0].uri;
    backend = "existing";
  } else {
    try {
      const stored = await putObject(sql, {
        userId: opts.userId,
        zone,
        key,
        bytes: opts.bytes,
        mime: opts.mime,
      });
      uri = stored.uri;
      backend = stored.backend;
    } catch (err) {
      uri = "";
      backend = "none";
      status = "failed";
      failure = `Original was NOT preserved: ${err instanceof Error ? err.message : String(err)}. Do not clear the source.`;
    }
  }

  await sql.query(
    `insert into files
      (id, user_id, batch_id, kind, original_name, mime, byte_size, checksum_sha256,
       zone, uri, status, failure_reason)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      id,
      opts.userId,
      opts.batchId,
      kind,
      opts.originalName,
      opts.mime,
      opts.bytes.byteLength,
      checksum,
      zone,
      uri,
      status,
      failure,
    ],
  );

  const file = await getFile(sql, opts.userId, id);
  if (!file) throw new Error("FILE_ROW_WRITE_FAILED");
  return { file, duplicateOf, backend };
}

export async function getFile(sql: Sql, userId: string, id: string): Promise<FileRow | null> {
  const rows = await sql.query<FileRow>(
    `select ${FILE_SELECT} from files where id = $1 and user_id = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function listFiles(
  sql: Sql,
  userId: string,
  opts: { kind?: string; batchId?: string; limit?: number } = {},
): Promise<FileRow[]> {
  return sql.query<FileRow>(
    `select ${FILE_SELECT} from files
     where user_id = $1
       and ($2::text is null or kind = $2)
       and ($3::text is null or batch_id = $3)
     order by created_at desc limit $4`,
    [userId, opts.kind ?? null, opts.batchId ?? null, opts.limit ?? 200],
  );
}

export async function listBatches(sql: Sql, userId: string) {
  return sql.query(
    `select b.id, b.label, b.kind, b.note, b.workflow_id, b.created_at::text as created_at,
            count(f.id)::int as file_count,
            count(f.id) filter (where f.status = 'review')::int as review_count,
            count(f.id) filter (where f.status = 'failed')::int as failed_count
     from batches b left join files f on f.batch_id = b.id
     where b.user_id = $1
     group by b.id order by b.created_at desc limit 50`,
    [userId],
  );
}

/**
 * Look at an image and write down only what is visible. Uncertainty goes to
 * review; it is never resolved by guessing. A model failure is recorded as a
 * failure — the file stays preserved and cataloged either way.
 */
export async function analyzeImage(
  sql: Sql,
  userId: string,
  file: FileRow,
  bytes: Buffer,
): Promise<FileRow> {
  await sql.query(`update files set status = 'analyzing', updated_at = now() where id = $1`, [
    file.id,
  ]);

  const result = await invokeVision({
    prompt:
      `Cataloging photo "${file.original_name}". Describe only what is visible. ` +
      `Do not name a brand, designer, model, person, or value unless the text is legibly ` +
      `visible in the image. Uncertainty is an acceptable answer.`,
    imageBase64: bytes.toString("base64"),
    mime: file.mime,
  });

  if (!result.ok) {
    await sql.query(
      `update files set status = 'review', uncertainty = $2, failure_reason = $3, updated_at = now()
       where id = $1`,
      [
        file.id,
        "Not analyzed — the file is preserved and cataloged, but nothing was concluded about it.",
        result.error,
      ],
    );
    return (await getFile(sql, userId, file.id))!;
  }

  await recordUsage(sql, { userId, kind: "vision", costCents: result.costCents });

  let parsed: Record<string, unknown> = {};
  try {
    const text = result.text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
    parsed = JSON.parse(text);
  } catch {
    parsed = { description: result.text.trim() };
  }

  const description = String(parsed.description ?? "").trim();
  const confidence = Number(parsed.confidence ?? 0);
  const uncertainReasons = Array.isArray(parsed.uncertain_reasons)
    ? (parsed.uncertain_reasons as unknown[]).map(String).filter(Boolean)
    : [];
  const uncertain = uncertainReasons.length > 0 || (confidence > 0 && confidence < 0.5);

  // A working name, from what was actually seen. The original name is a
  // column of its own and is never overwritten.
  const slug = description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .split("-")
    .filter(Boolean)
    .slice(0, 6)
    .join("-");
  const workingName = slug ? `${slug}${extensionOf(file.original_name)}` : null;

  await sql.query(
    `update files
       set status = $2, analysis_json = $3, working_name = $4, uncertainty = $5, updated_at = now()
     where id = $1`,
    [
      file.id,
      uncertain ? "review" : "cataloged",
      JSON.stringify(parsed),
      workingName,
      uncertain ? uncertainReasons.join("; ") || "Low confidence on identity." : null,
    ],
  );

  // What the agent concluded is recorded as inference, kept separate from
  // anything Dayna said.
  if (description) {
    await writeContext(sql, {
      userId,
      kind: "agent_inference",
      body: `Photo ${file.original_name}: ${description}`,
      author: "role:34",
      source: "photo_intake",
      confidence: confidence || null,
    });
  }

  return (await getFile(sql, userId, file.id))!;
}

/** Extract text from a document we can read as text. PDFs stay preserved-only. */
export async function extractDocumentText(
  sql: Sql,
  userId: string,
  file: FileRow,
  bytes: Buffer,
): Promise<FileRow> {
  const readable =
    file.mime.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(file.original_name);
  if (!readable) {
    await sql.query(
      `update files set status = 'review', uncertainty = $2, updated_at = now() where id = $1`,
      [
        file.id,
        `Preserved. Text was not extracted from ${file.mime} yet, so nothing has been concluded from its contents.`,
      ],
    );
    return (await getFile(sql, userId, file.id))!;
  }
  const text = bytes.toString("utf-8").slice(0, 200_000);
  await sql.query(
    `update files set status = 'cataloged', extracted_text = $2, updated_at = now() where id = $1`,
    [file.id, text],
  );
  return (await getFile(sql, userId, file.id))!;
}

/**
 * Start the workflow for this batch. The chain is the one Dayna chose — from
 * the page she is on, or by picking it. Nothing here infers what she meant.
 */
export async function startBatchWorkflow(
  sql: Sql,
  opts: { userId: string; batchId: string; chainId: string; statement: string },
): Promise<string> {
  const started = await startChain(sql, {
    userId: opts.userId,
    chainId: opts.chainId,
    requestStatement: opts.statement,
    subjectKind: "batch",
    subjectId: opts.batchId,
  });
  await sql.query(`update batches set workflow_id = $2 where id = $1`, [
    opts.batchId,
    started.workflowId,
  ]);
  await sql.query(`update files set workflow_id = $2 where batch_id = $1`, [
    opts.batchId,
    started.workflowId,
  ]);
  return started.workflowId;
}
