import { getSql } from "@/lib/db";
import { ensureDataDirs, dataDir, diskStorageEnabled, pgliteDir } from "./data-dir.ts";
import { startQueueWorker } from "./queue.ts";

let started = false;

export function ensureServerRuntime(): void {
  if (started) return;
  started = true;
  ensureDataDirs();
  startQueueWorker(getSql);
}

export function serverFacts() {
  ensureDataDirs();
  return {
    dataDir: dataDir(),
    pgliteDir: pgliteDir(),
    diskStorage: diskStorageEnabled(),
    db: process.env.DATABASE_URL?.trim() ? "neon" : "pglite-file",
  };
}
