import type { Sql } from "@/lib/db";
import { newId } from "./ids.ts";
import { ingestOriginal } from "./storage.ts";
import { classifyIntakeDomain } from "./workflows.ts";
import { startChain } from "./runtime.ts";
import { createWorkPackage } from "./package.ts";
import { enqueueJob } from "./queue.ts";
import { writeContext } from "./context.ts";
import { audit } from "./workspace.ts";
import { invokeLlm, llmAvailable } from "./llm.ts";

export type DocumentRow = {
  id: string;
  blob_id: string;
  original_filename: string;
  managed_filename: string | null;
  checksum_sha256: string;
  mime: string | null;
  classification: string | null;
  classification_confidence: number | null;
  extracted_text: string | null;
  routed_role: number | null;
  review_state: string;
  is_test_only: number;
};

function extractText(bytes: Uint8Array, mime: string, filename: string): string | null {
  const textish =
    mime.startsWith("text/") ||
    mime === "application/json" ||
    /\.(txt|md|csv|json|html)$/i.test(filename);
  if (!textish) return null;
  return Buffer.from(bytes).toString("utf8");
}

function classify(text: string | null, filename: string): {
  classification: string;
  confidence: number;
  review: boolean;
  role: number;
} {
  if (text && text.includes("TEST_ONLY")) {
    return { classification: "synthetic_test_only", confidence: 1, review: false, role: 36 };
  }
  if (!text) {
    return { classification: "unextracted", confidence: 0, review: true, role: 36 };
  }
  const domain = classifyIntakeDomain(text + " " + filename);
  return {
    classification: domain.uncertain ? "uncertain" : domain.chainId,
    confidence: domain.confidence,
    review: domain.uncertain,
    role: domain.roleId,
  };
}

export async function ingestDocument(
  sql: Sql,
  opts: {
    userId: string;
    filename: string;
    mime: string;
    bytes: Uint8Array;
    isTestOnly?: boolean;
  },
): Promise<DocumentRow> {
  const stored = await ingestOriginal(sql, {
    userId: opts.userId,
    bytes: opts.bytes,
    mime: opts.mime,
    originalFilename: opts.filename,
  });
  const blob = stored.original;
  const extracted = extractText(opts.bytes, opts.mime, opts.filename);
  let cls = classify(extracted, opts.filename);

  if (llmAvailable() && extracted && cls.review) {
    const llm = await invokeLlm({
      system:
        "Classify this document for routing. Use only the text. If it is TEST_ONLY or nonsense, say synthetic_test_only. Never invent a user-life category. JSON: {classification, confidence, role_id, uncertain}.",
      user: extracted.slice(0, 4000),
      maxTokens: 200,
    });
    if (llm.ok) {
      try {
        const parsed: unknown = JSON.parse(
          llm.text.slice(llm.text.indexOf("{"), llm.text.lastIndexOf("}") + 1),
        );
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          // Coerce each field; a value the model got wrong falls back to the
          // local classification instead of crashing the insert into typed
          // columns (real / integer). Uncoercible material routes to review.
          const p = parsed as Record<string, unknown>;
          const classification =
            typeof p.classification === "string" && p.classification.trim()
              ? p.classification.trim().toLowerCase()
              : cls.classification;
          const confidenceNum =
            typeof p.confidence === "number"
              ? p.confidence
              : typeof p.confidence === "string"
                ? Number.parseFloat(p.confidence)
                : NaN;
          const confidence =
            Number.isFinite(confidenceNum) && confidenceNum >= 0 && confidenceNum <= 1
              ? confidenceNum
              : cls.confidence;
          const roleNum =
            typeof p.role_id === "number"
              ? p.role_id
              : typeof p.role_id === "string"
                ? Number.parseInt(p.role_id, 10)
                : NaN;
          const role = Number.isInteger(roleNum) && roleNum >= 1 && roleNum <= 40 ? roleNum : cls.role;
          const coercionFailed =
            (p.confidence != null && confidence === cls.confidence && !Number.isFinite(confidenceNum)) ||
            (p.role_id != null && role === cls.role && !Number.isInteger(roleNum));
          cls = {
            classification,
            confidence,
            review: Boolean(p.uncertain) || coercionFailed || cls.review,
            role,
          };
        } else {
          cls = { ...cls, review: true };
        }
      } catch {
        cls = { ...cls, review: true };
      }
    } else {
      cls = { ...cls, review: true };
    }
  }

  const managed = `${opts.isTestOnly ? "TEST_ONLY_" : ""}${blob.id.slice(0, 8)}_${opts.filename.replace(/[^A-Za-z0-9._-]+/g, "_")}`;
  const id = newId("doc");
  await sql.query(
    `insert into documents
      (id, user_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
       classification, classification_confidence, extracted_text, routed_role, review_state, is_test_only)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [
      id,
      opts.userId,
      blob.id,
      opts.filename,
      managed,
      blob.checksum_sha256,
      opts.mime,
      cls.classification,
      cls.confidence,
      extracted,
      cls.role,
      cls.review ? "review" : "none",
      opts.isTestOnly ? 1 : 0,
    ],
  );

  const known = ["career", "writing", "business", "financial", "resale", "media", "technical", "forensic"];
  const chainId = known.includes(cls.classification) ? cls.classification : "forensic";
  const pkg = await createWorkPackage(sql, {
    userId: opts.userId,
    title: `Document ${opts.filename}`,
    objective: `Catalog and route this original. Classification candidate=${cls.classification}. Filename is not truth.`,
    payload: {
      documentId: id,
      blobId: blob.id,
      filename: opts.filename,
      checksum: blob.checksum_sha256,
      extractedText: extracted,
      classification: cls.classification,
    },
  });
  const wf = await startChain(sql, {
    userId: opts.userId,
    chainId,
    requestStatement: `Work this original. Document ${id}. Classification=${cls.classification}. Do not invent identity.`,
    subjectId: id,
    subjectKind: "document",
    isTestOnly: opts.isTestOnly,
    packageId: pkg.id,
    input: {
      documentId: id,
      blobId: blob.id,
      checksum: blob.checksum_sha256,
      extractedText: extracted,
      classification: cls.classification,
    },
  });
  const job = await enqueueJob(sql, {
    userId: opts.userId,
    kind: "drive_workflow",
    payload: { workflowId: wf.workflowId, documentId: id },
  });

  await writeContext(sql, {
    userId: opts.userId,
    kind: "external_evidence",
    body: `Document ${id} (${opts.filename}) preserved. classification=${cls.classification} confidence=${cls.confidence}`,
    author: "system",
    source: "documents.ingestDocument",
    confidence: cls.confidence,
  });

  await audit(sql, {
    userId: opts.userId,
    actor: "system",
    action: "ingestDocument",
    target: id,
    detail: cls.classification,
  });

  const rows = await sql.query<DocumentRow>(
    `select id, blob_id, original_filename, managed_filename, checksum_sha256, mime, classification,
            classification_confidence, extracted_text, routed_role, review_state, is_test_only
     from documents where id = $1 and user_id = $2`,
    [id, opts.userId],
  );
  return rows[0];
}

export type DocumentListRow = {
  id: string;
  blob_id: string;
  original_filename: string;
  managed_filename: string | null;
  checksum_sha256: string;
  mime: string | null;
  classification: string | null;
  classification_confidence: number | null;
  routed_role: number | null;
  review_state: string;
  is_test_only: number;
  created_at: string;
};

export async function listDocuments(sql: Sql, userId: string): Promise<DocumentListRow[]> {
  return sql.query<DocumentListRow>(
    `select id, blob_id, original_filename, managed_filename, checksum_sha256, mime, classification,
            classification_confidence, routed_role, review_state, is_test_only, created_at::text as created_at
     from documents where user_id = $1 order by created_at desc limit 80`,
    [userId],
  );
}
