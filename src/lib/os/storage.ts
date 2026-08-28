import type { Sql } from "@/lib/db";
import { newId, sha256Hex } from "./ids.ts";

export const STORAGE_ZONES = [
  "originals",
  "intake",
  "temp",
  "derivatives",
  "review",
  "agent_ready",
  "outputs",
  "catalog",
  "archive",
] as const;

export type StorageZone = (typeof STORAGE_ZONES)[number];

export type StoredBlob = {
  id: string;
  user_id: string;
  zone: StorageZone;
  object_key: string;
  checksum_sha256: string;
  mime: string | null;
  byte_size: number;
  original_filename: string | null;
  immutable: number;
  created_at: string;
};

function isZone(z: string): z is StorageZone {
  return (STORAGE_ZONES as readonly string[]).includes(z);
}

function asBytes(value: unknown): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return new Uint8Array(value);
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (typeof value === "string") {
    const hex = value.startsWith("\\x") ? value.slice(2) : value;
    if (/^[0-9a-fA-F]+$/.test(hex) && hex.length % 2 === 0) {
      return Uint8Array.from(Buffer.from(hex, "hex"));
    }
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  throw new Error("BLOB_BYTES_UNREADABLE");
}

function sanitizeName(name: string): string {
  return name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 180) || "unnamed";
}

export async function putObject(
  sql: Sql,
  opts: {
    userId: string;
    zone: StorageZone;
    bytes: Uint8Array;
    mime?: string | null;
    originalFilename?: string | null;
    immutable?: boolean;
  },
): Promise<StoredBlob> {
  if (!isZone(opts.zone)) throw new Error(`UNKNOWN_ZONE:${opts.zone}`);
  const id = newId("blob");
  const checksum = sha256Hex(opts.bytes);
  const filename = opts.originalFilename ? sanitizeName(opts.originalFilename) : "object";
  const objectKey = `${opts.zone}/${id}/${filename}`;
  const immutable = opts.immutable || opts.zone === "originals" ? 1 : 0;
  const buf = Buffer.from(opts.bytes);
  await sql.query(
    `insert into object_blobs
      (id, user_id, zone, object_key, checksum_sha256, mime, byte_size, bytes, original_filename, immutable)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      id,
      opts.userId,
      opts.zone,
      objectKey,
      checksum,
      opts.mime ?? null,
      opts.bytes.byteLength,
      buf,
      opts.originalFilename ?? null,
      immutable,
    ],
  );
  const verified = await getObject(sql, opts.userId, id);
  if (!verified || verified.checksum_sha256 !== checksum) {
    throw new Error("PERSISTENCE_VERIFY_FAILED");
  }
  const roundTrip = await getObjectBytes(sql, opts.userId, id);
  if (sha256Hex(roundTrip) !== checksum) {
    throw new Error("CHECKSUM_MISMATCH_AFTER_WRITE");
  }
  return verified;
}

export async function getObject(sql: Sql, userId: string, id: string): Promise<StoredBlob | null> {
  const rows = await sql.query<StoredBlob>(
    `select id, user_id, zone, object_key, checksum_sha256, mime, byte_size, original_filename, immutable, created_at::text as created_at
     from object_blobs where id = $1 and user_id = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function getObjectBytes(sql: Sql, userId: string, id: string): Promise<Uint8Array> {
  const rows = await sql.query<{ bytes: unknown }>(
    `select bytes from object_blobs where id = $1 and user_id = $2`,
    [id, userId],
  );
  if (!rows[0]) throw new Error("BLOB_NOT_FOUND");
  return asBytes(rows[0].bytes);
}

export async function assertOriginalImmutable(sql: Sql, userId: string, id: string): Promise<void> {
  const row = await getObject(sql, userId, id);
  if (!row) throw new Error("BLOB_NOT_FOUND");
  if (row.immutable !== 1 && row.zone !== "originals") return;
  throw new Error("ORIGINAL_IMMUTABLE");
}

export async function tryMutateOriginal(
  sql: Sql,
  userId: string,
  id: string,
  bytes: Uint8Array,
): Promise<never> {
  const row = await getObject(sql, userId, id);
  if (!row) throw new Error("BLOB_NOT_FOUND");
  if (row.immutable === 1 || row.zone === "originals") {
    throw new Error("ORIGINAL_IMMUTABLE");
  }
  await sql.query(
    `update object_blobs set bytes = $1, byte_size = $2, checksum_sha256 = $3
     where id = $4 and user_id = $5 and immutable = 0`,
    [Buffer.from(bytes), bytes.byteLength, sha256Hex(bytes), id, userId],
  );
  throw new Error("UNEXPECTED_MUTATION_PATH");
}

export async function putDerivative(
  sql: Sql,
  opts: {
    userId: string;
    originalAssetId: string;
    bytes: Uint8Array;
    mime?: string | null;
    purpose: string;
    originalFilename?: string | null;
  },
): Promise<{ blob: StoredBlob; derivativeId: string }> {
  const blob = await putObject(sql, {
    userId: opts.userId,
    zone: "derivatives",
    bytes: opts.bytes,
    mime: opts.mime,
    originalFilename: opts.originalFilename ?? `${opts.purpose}.bin`,
    immutable: false,
  });
  const derivativeId = newId("drv");
  await sql.query(
    `insert into media_derivatives (id, user_id, original_asset_id, blob_id, purpose, lineage_note)
     values ($1,$2,$3,$4,$5,$6)`,
    [
      derivativeId,
      opts.userId,
      opts.originalAssetId,
      blob.id,
      opts.purpose,
      `derivative of ${opts.originalAssetId}; original unchanged`,
    ],
  );
  return { blob, derivativeId };
}

export async function clearTempIfOriginalsVerified(
  sql: Sql,
  userId: string,
  originalIds: string[],
): Promise<{ cleared: number; blocked: string | null }> {
  for (const id of originalIds) {
    const obj = await getObject(sql, userId, id);
    if (!obj || obj.zone !== "originals") {
      return { cleared: 0, blocked: "ORIGINAL_NOT_VERIFIED" };
    }
    const bytes = await getObjectBytes(sql, userId, id);
    if (sha256Hex(bytes) !== obj.checksum_sha256) {
      return { cleared: 0, blocked: "CHECKSUM_FAILED" };
    }
  }
  const rows = await sql.query<{ n: number }>(
    `delete from object_blobs where user_id = $1 and zone = 'temp'
     returning 1 as n`,
    [userId],
  );
  return { cleared: rows.length, blocked: null };
}

export async function listZone(sql: Sql, userId: string, zone: StorageZone): Promise<StoredBlob[]> {
  return sql.query<StoredBlob>(
    `select id, user_id, zone, object_key, checksum_sha256, mime, byte_size, original_filename, immutable, created_at::text as created_at
     from object_blobs where user_id = $1 and zone = $2 order by created_at desc`,
    [userId, zone],
  );
}

export async function ingestOriginal(
  sql: Sql,
  opts: {
    userId: string;
    bytes: Uint8Array;
    mime?: string | null;
    originalFilename?: string | null;
  },
): Promise<{ intake: StoredBlob; original: StoredBlob; catalog: StoredBlob }> {
  const intake = await putObject(sql, {
    userId: opts.userId,
    zone: "intake",
    bytes: opts.bytes,
    mime: opts.mime,
    originalFilename: opts.originalFilename,
    immutable: false,
  });
  const original = await putObject(sql, {
    userId: opts.userId,
    zone: "originals",
    bytes: opts.bytes,
    mime: opts.mime,
    originalFilename: opts.originalFilename,
    immutable: true,
  });
  if (intake.checksum_sha256 !== original.checksum_sha256) {
    throw new Error("INTAKE_ORIGINAL_CHECKSUM_MISMATCH");
  }
  const manifest = Buffer.from(
    JSON.stringify({
      original_id: original.id,
      intake_id: intake.id,
      checksum_sha256: original.checksum_sha256,
      original_filename: original.original_filename,
      mime: original.mime,
      byte_size: original.byte_size,
      object_key: original.object_key,
    }),
  );
  const catalog = await putObject(sql, {
    userId: opts.userId,
    zone: "catalog",
    bytes: new Uint8Array(manifest),
    mime: "application/json",
    originalFilename: `${(opts.originalFilename ?? "object").slice(0, 80)}.manifest.json`,
    immutable: false,
  });
  return { intake, original, catalog };
}

export async function zoneCensus(
  sql: Sql,
  userId: string,
): Promise<{ zone: StorageZone; count: number; bytes: number; lastWrite: string | null }[]> {
  const rows = await sql.query<{ zone: string; count: number; bytes: number; last_write: string | null }>(
    `select zone, count(*)::int as count, coalesce(sum(byte_size),0)::int as bytes,
            max(created_at)::text as last_write
     from object_blobs where user_id = $1 group by zone`,
    [userId],
  );
  return STORAGE_ZONES.map((zone) => {
    const hit = rows.find((r) => r.zone === zone);
    return {
      zone,
      count: Number(hit?.count ?? 0),
      bytes: Number(hit?.bytes ?? 0),
      lastWrite: hit?.last_write ?? null,
    };
  });
}
