/**
 * Where Dayna's files actually live.
 *
 * Two backends, chosen by environment, with the same contract:
 *   - Object store (preferred): STORAGE_BUCKET_PREFIX set -> Google Cloud
 *     Storage over its JSON API, authenticated by the runtime's own identity
 *     (Cloud Run metadata server). No keys in code, none in the repo.
 *   - Postgres (fallback): bytes land in `file_blobs`.
 *
 * The fallback exists for one reason: "your file is preserved" must never be a
 * claim the system cannot back up. If the bucket is unreachable, we do not
 * pretend the upload worked and we do not drop the bytes — we store them where
 * we can and say which happened.
 */
import type { Sql } from "./db.ts";
import { newId } from "./ids.ts";

export const ZONES = [
  "intake",
  "originals",
  "catalog",
  "derivatives",
  "outputs",
  "review",
  "archive",
] as const;
export type Zone = (typeof ZONES)[number];

const BUCKET_PREFIX = process.env.STORAGE_BUCKET_PREFIX?.trim();

export function bucketFor(zone: Zone): string | null {
  return BUCKET_PREFIX ? `${BUCKET_PREFIX}-${zone}` : null;
}

export function objectStoreConfigured(): boolean {
  return Boolean(BUCKET_PREFIX);
}

let cachedToken: { value: string; expires: number } | null = null;

async function accessToken(): Promise<string | null> {
  if (process.env.GOOGLE_OAUTH_TOKEN?.trim()) return process.env.GOOGLE_OAUTH_TOKEN.trim();
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.value;
  try {
    const res = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      { headers: { "Metadata-Flavor": "Google" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;
    cachedToken = {
      value: json.access_token,
      expires: Date.now() + Math.max(60, (json.expires_in ?? 300) - 120) * 1000,
    };
    return cachedToken.value;
  } catch {
    return null;
  }
}

export type StoredObject = {
  uri: string;
  backend: "object_store" | "database";
  zone: Zone;
};

/**
 * Write bytes durably. Returns the uri to record on the row. Throws only when
 * neither backend accepted the bytes — the caller must then report a failure
 * rather than a success.
 */
export async function putObject(
  sql: Sql,
  opts: { userId: string; zone: Zone; key: string; bytes: Buffer; mime: string },
): Promise<StoredObject> {
  const bucket = bucketFor(opts.zone);
  if (bucket) {
    const token = await accessToken();
    if (token) {
      const url =
        `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o` +
        `?uploadType=media&name=${encodeURIComponent(opts.key)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": opts.mime },
        body: new Uint8Array(opts.bytes),
      });
      if (res.ok) {
        return { uri: `gs://${bucket}/${opts.key}`, backend: "object_store", zone: opts.zone };
      }
      // Fall through to the database rather than losing the file. The caller
      // surfaces the backend actually used, so this is never silent.
    }
  }
  const id = newId("blob");
  await sql.query(
    `insert into file_blobs (id, user_id, bytes, byte_size, mime) values ($1,$2,$3,$4,$5)`,
    [id, opts.userId, opts.bytes, opts.bytes.byteLength, opts.mime],
  );
  return { uri: `db://file_blobs/${id}`, backend: "database", zone: opts.zone };
}

/** Read bytes back for either backend. Null means genuinely not retrievable. */
export async function getObject(
  sql: Sql,
  uri: string,
  userId: string,
): Promise<{ bytes: Buffer; mime: string | null } | null> {
  if (uri.startsWith("db://file_blobs/")) {
    const id = uri.slice("db://file_blobs/".length);
    const rows = await sql.query<{ bytes: Buffer; mime: string | null }>(
      `select bytes, mime from file_blobs where id = $1 and user_id = $2`,
      [id, userId],
    );
    return rows[0] ?? null;
  }
  if (uri.startsWith("gs://")) {
    const token = await accessToken();
    if (!token) return null;
    const rest = uri.slice("gs://".length);
    const slash = rest.indexOf("/");
    const bucket = rest.slice(0, slash);
    const key = rest.slice(slash + 1);
    const res = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(key)}?alt=media`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return { bytes: buf, mime: res.headers.get("content-type") };
  }
  return null;
}

/** Reported on the Photos page so Dayna can see where her originals sit. */
export async function storageHealth(): Promise<{
  backend: "object_store" | "database";
  buckets: string[];
  reachable: boolean;
}> {
  if (!BUCKET_PREFIX) {
    return { backend: "database", buckets: [], reachable: true };
  }
  const token = await accessToken();
  return {
    backend: "object_store",
    buckets: ZONES.map((z) => `${BUCKET_PREFIX}-${z}`),
    reachable: Boolean(token),
  };
}
