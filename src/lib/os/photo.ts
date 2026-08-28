import type { Sql } from "@/lib/db";
import { newId, sha256Hex } from "./ids.ts";
import { putDerivative, ingestOriginal } from "./storage.ts";
import { invokeVision, llmAvailable } from "./llm.ts";
import { startChain, driveWorkflow } from "./runtime.ts";
import { writeContext } from "./context.ts";
import { audit } from "./workspace.ts";

export type MediaAssetRow = {
  id: string;
  batch_id: string;
  blob_id: string;
  original_filename: string;
  managed_filename: string | null;
  checksum_sha256: string;
  mime: string | null;
  quality_flag: string | null;
  duplicate_group: string | null;
  analysis_json: string | null;
  analysis_model: string | null;
  analysis_confidence: number | null;
  purpose_candidate: string | null;
  purpose_confidence: number | null;
  review_state: string;
  workflow_state: string;
  is_test_only: number;
};

function pngSize(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 24) return null;
  if (bytes[0] !== 137 || bytes[1] !== 80) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function qualityFlag(bytes: Uint8Array, dims: { width: number; height: number } | null): string {
  if (bytes.byteLength < 32) return "unusable";
  if (dims && (dims.width < 8 || dims.height < 8)) return "low";
  return "ok";
}

export async function ingestPhotoBatch(
  sql: Sql,
  opts: {
    userId: string;
    files: { filename: string; mime: string; bytes: Uint8Array }[];
    sourceType: string;
    purpose?: string;
    isTestOnly?: boolean;
    projectId?: string | null;
  },
): Promise<{
  batchId: string;
  assets: MediaAssetRow[];
  originalsPreserved: boolean;
  workflowId: string | null;
  reviewCount: number;
}> {
  if (!opts.files.length) throw new Error("EMPTY_BATCH");
  const batchId = newId("bat");
  await sql.query(
    `insert into media_batches (id, user_id, source_type, status, project_id, purpose, item_count)
     values ($1,$2,$3,'intake',$4,$5,$6)`,
    [
      batchId,
      opts.userId,
      opts.sourceType,
      opts.projectId ?? null,
      opts.purpose ?? null,
      opts.files.length,
    ],
  );

  const checksumIndex = new Map<string, string>();
  const assets: MediaAssetRow[] = [];
  const originalIds: string[] = [];

  for (let i = 0; i < opts.files.length; i++) {
    const file = opts.files[i];
    const stored = await ingestOriginal(sql, {
      userId: opts.userId,
      bytes: file.bytes,
      mime: file.mime,
      originalFilename: file.filename,
    });
    const blob = stored.original;
    originalIds.push(blob.id);
    const checksum = blob.checksum_sha256;
    let duplicateGroup: string | null = null;
    if (checksumIndex.has(checksum)) {
      duplicateGroup = checksumIndex.get(checksum)!;
    } else {
      checksumIndex.set(checksum, `dup_${checksum.slice(0, 12)}`);
    }
    const dims = pngSize(file.bytes);
    const quality = qualityFlag(file.bytes, dims);
    let analysisJson: string | null = null;
    let analysisModel: string | null = null;
    let analysisConfidence: number | null = null;
    let reviewState = "none";
    let purposeCandidate = opts.purpose ?? null;
    let purposeConfidence = opts.purpose ? 0.4 : null;

    if (llmAvailable() && file.mime.startsWith("image/")) {
      const vision = await invokeVision({
        prompt:
          "TEST_ONLY catalog analysis. Describe geometry and color only. Do not identify people, brands, or products.",
        imageBase64: Buffer.from(file.bytes).toString("base64"),
        mime: file.mime,
      });
      if (vision.ok) {
        analysisJson = vision.text;
        analysisModel = vision.model;
        analysisConfidence = 0.6;
      } else {
        analysisJson = JSON.stringify({ error: vision.error, code: vision.code });
        analysisModel = "unavailable";
        reviewState = "review";
        analysisConfidence = 0;
      }
    } else {
      analysisJson = JSON.stringify({
        description: "Vision not run. Original preserved. Identity not invented.",
        geometry: dims,
        code: llmAvailable() ? "NOT_IMAGE" : "LLM_UNAVAILABLE",
      });
      analysisModel = llmAvailable() ? "none" : "unavailable";
      reviewState = "review";
      analysisConfidence = 0;
    }

    if (quality === "unusable" || quality === "low") reviewState = "review";
    if (duplicateGroup && checksumIndex.get(checksum) !== `dup_${checksum.slice(0, 12)}`) {
      reviewState = "review";
    }
    if (checksumIndex.get(checksum) && assets.some((a) => a.checksum_sha256 === checksum)) {
      duplicateGroup = checksumIndex.get(checksum)!;
      reviewState = "review";
    }

    const managed = managedName({
      index: i,
      batchId,
      mime: file.mime,
      dims,
      isTestOnly: Boolean(opts.isTestOnly),
      original: file.filename,
    });

    const assetId = newId("med");
    await sql.query(
      `insert into media_assets
        (id, user_id, batch_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
         width, height, metadata_json, metadata_trust, analysis_json, analysis_model, analysis_confidence,
         purpose_candidate, purpose_confidence, quality_flag, duplicate_group, owner_role, review_state,
         workflow_state, is_test_only)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'untrusted',$12,$13,$14,$15,$16,$17,$18,34,$19,'preserved',$20)`,
      [
        assetId,
        opts.userId,
        batchId,
        blob.id,
        file.filename,
        managed,
        checksum,
        file.mime,
        dims?.width ?? null,
        dims?.height ?? null,
        JSON.stringify({ exif: "unread", trust: "untrusted" }),
        analysisJson,
        analysisModel,
        analysisConfidence,
        purposeCandidate,
        purposeConfidence,
        quality,
        duplicateGroup,
        reviewState,
        opts.isTestOnly ? 1 : 0,
      ],
    );

    await putDerivative(sql, {
      userId: opts.userId,
      originalAssetId: assetId,
      bytes: file.bytes,
      mime: file.mime,
      purpose: "catalog_working_copy",
      originalFilename: managed,
    });

    assets.push({
      id: assetId,
      batch_id: batchId,
      blob_id: blob.id,
      original_filename: file.filename,
      managed_filename: managed,
      checksum_sha256: checksum,
      mime: file.mime,
      quality_flag: quality,
      duplicate_group: duplicateGroup,
      analysis_json: analysisJson,
      analysis_model: analysisModel,
      analysis_confidence: analysisConfidence,
      purpose_candidate: purposeCandidate,
      purpose_confidence: purposeConfidence,
      review_state: reviewState,
      workflow_state: "preserved",
      is_test_only: opts.isTestOnly ? 1 : 0,
    });
  }

  await sql.query(`update media_batches set status = 'catalogued', item_count = $1 where id = $2 and user_id = $3`, [
    assets.length,
    batchId,
    opts.userId,
  ]);

  let workflowId: string | null = null;
  const looksResale = (opts.purpose ?? "").toLowerCase().includes("resale") || opts.sourceType === "resale";
  const chainId = looksResale ? "resale" : "media";
  const wf = await startChain(sql, {
    userId: opts.userId,
    chainId,
    requestStatement: looksResale
      ? `Resale intake from photo batch ${batchId}`
      : `Media custody for batch ${batchId}`,
    subjectId: batchId,
    isTestOnly: opts.isTestOnly,
  });
  workflowId = wf.workflowId;
  await driveWorkflow(sql, opts.userId, wf.workflowId);
  if (looksResale) {
    await sql.query(
      `insert into resale_items (id, user_id, batch_id, title, status)
       values ($1,$2,$3,$4,'intake')`,
      [newId("itm"), opts.userId, batchId, `Item from ${batchId}`],
    );
  }

  await writeContext(sql, {
    userId: opts.userId,
    kind: "verified_fact",
    body: `Media batch ${batchId} preserved ${assets.length} originals with checksums.`,
    author: "system",
    source: "photo.ingestPhotoBatch",
    confidence: 1,
  });

  await audit(sql, {
    userId: opts.userId,
    actor: "role:34",
    action: "ingestPhotoBatch",
    target: batchId,
    detail: `${assets.length} originals`,
  });

  const reviewCount = assets.filter((a) => a.review_state === "review").length;
  return {
    batchId,
    assets,
    originalsPreserved: originalIds.length === opts.files.length,
    workflowId,
    reviewCount,
  };
}

function managedName(opts: {
  index: number;
  batchId: string;
  mime: string;
  dims: { width: number; height: number } | null;
  isTestOnly: boolean;
  original: string;
}): string {
  const ext = opts.mime.includes("png")
    ? "png"
    : opts.mime.includes("jpeg") || opts.mime.includes("jpg")
      ? "jpg"
      : opts.original.split(".").pop() || "bin";
  const prefix = opts.isTestOnly ? "TEST_ONLY" : "managed";
  const geom = opts.dims ? `${opts.dims.width}x${opts.dims.height}` : "unknown";
  return `${prefix}_${opts.batchId.slice(0, 8)}_${String(opts.index + 1).padStart(3, "0")}_${geom}.${ext}`;
}

export type BatchListRow = {
  id: string;
  source_type: string;
  status: string;
  purpose: string | null;
  item_count: number;
  created_at: string;
};

export type AssetListRow = {
  id: string;
  batch_id: string;
  blob_id: string;
  original_filename: string;
  managed_filename: string | null;
  checksum_sha256: string;
  mime: string | null;
  quality_flag: string | null;
  duplicate_group: string | null;
  analysis_model: string | null;
  analysis_confidence: number | null;
  purpose_candidate: string | null;
  review_state: string;
  workflow_state: string;
  is_test_only: number;
  created_at: string;
};

export async function listBatches(sql: Sql, userId: string): Promise<BatchListRow[]> {
  return sql.query<BatchListRow>(
    `select id, source_type, status, purpose, item_count, created_at::text as created_at
     from media_batches where user_id = $1 order by created_at desc limit 40`,
    [userId],
  );
}

export async function listAssets(sql: Sql, userId: string, batchId?: string): Promise<AssetListRow[]> {
  if (batchId) {
    return sql.query<AssetListRow>(
      `select id, batch_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
              quality_flag, duplicate_group, analysis_model, analysis_confidence, purpose_candidate,
              review_state, workflow_state, is_test_only, created_at::text as created_at
       from media_assets where user_id = $1 and batch_id = $2 order by created_at`,
      [userId, batchId],
    );
  }
  return sql.query<AssetListRow>(
    `select id, batch_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
            quality_flag, duplicate_group, analysis_model, analysis_confidence, purpose_candidate,
            review_state, workflow_state, is_test_only, created_at::text as created_at
     from media_assets where user_id = $1 order by created_at desc limit 80`,
    [userId],
  );
}
