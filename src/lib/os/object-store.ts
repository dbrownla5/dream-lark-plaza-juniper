import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { diskStorageEnabled, storageDir } from "./data-dir.ts";
import { sha256Hex } from "./ids.ts";

export function objectPath(objectKey: string): string {
  return join(storageDir(), objectKey);
}

export function writeZoneObject(objectKey: string, bytes: Uint8Array): void {
  if (!diskStorageEnabled()) return;
  const path = objectPath(objectKey);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, bytes);
  if (sha256Hex(readFileSync(path)) !== sha256Hex(bytes)) {
    throw new Error("DISK_CHECKSUM_MISMATCH");
  }
}

export function readZoneObject(objectKey: string): Uint8Array | null {
  if (!diskStorageEnabled()) return null;
  const path = objectPath(objectKey);
  if (!existsSync(path)) return null;
  return new Uint8Array(readFileSync(path));
}

export function zoneObjectExists(objectKey: string): boolean {
  if (!diskStorageEnabled()) return false;
  return existsSync(objectPath(objectKey));
}
