import { mkdirSync } from "node:fs";
import { join } from "node:path";

/** Durable data root. Neon/Vercel keep rows in Postgres; this host keeps files on disk. */
export function dataDir(): string {
  return process.env.DATA_DIR?.trim() || join(process.cwd(), "data");
}

export function pgliteDir(): string {
  return join(dataDir(), "pglite");
}

export function storageDir(): string {
  return join(dataDir(), "storage");
}

export function diskStorageEnabled(): boolean {
  if (process.env.VERCEL === "1") return false;
  return process.env.DISK_STORAGE !== "0";
}

export function ensureDataDirs(): void {
  mkdirSync(pgliteDir(), { recursive: true });
  if (diskStorageEnabled()) {
    mkdirSync(storageDir(), { recursive: true });
  }
}
