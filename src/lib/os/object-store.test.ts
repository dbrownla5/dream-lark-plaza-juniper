import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { writeZoneObject, readZoneObject } from "./object-store.ts";
import { sha256Hex } from "./ids.ts";

test("disk zone write survives a second read", () => {
  const dir = join(process.cwd(), "data", "storage");
  mkdirSync(dir, { recursive: true });
  const key = "originals/blob_test/TEST_ONLY.bin";
  const bytes = new Uint8Array([9, 8, 7, 6, 5]);
  writeZoneObject(key, bytes);
  const back = readZoneObject(key);
  assert.ok(back);
  assert.equal(sha256Hex(back!), sha256Hex(bytes));
  rmSync(join(dir, "originals", "blob_test"), { recursive: true, force: true });
});
