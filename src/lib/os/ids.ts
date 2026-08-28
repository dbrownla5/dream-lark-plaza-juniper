import { createHash, randomUUID } from "node:crypto";

export function newId(prefix = ""): string {
  const id = randomUUID();
  return prefix ? `${prefix}_${id}` : id;
}

export function sha256Hex(data: Uint8Array | string): string {
  const h = createHash("sha256");
  h.update(typeof data === "string" ? data : Buffer.from(data));
  return h.digest("hex");
}

export function nowIso(): string {
  return new Date().toISOString();
}
