import assert from "node:assert/strict";
import test from "node:test";
import { makeSolidPng, TEST_ONLY_DOCUMENT } from "./fixtures.ts";
import { sha256Hex } from "./ids.ts";

test("synthetic PNG is geometric and checksum-stable", () => {
  const a = makeSolidPng(200, 40, 40, 16, 16);
  const b = makeSolidPng(200, 40, 40, 16, 16);
  assert.equal(a[0], 137);
  assert.equal(a[1], 80);
  assert.equal(sha256Hex(a), sha256Hex(b));
  const c = makeSolidPng(40, 40, 200, 16, 16);
  assert.notEqual(sha256Hex(a), sha256Hex(c));
});

test("test document is unmistakably synthetic", () => {
  assert.match(TEST_ONLY_DOCUMENT, /TEST_ONLY/);
  assert.match(TEST_ONLY_DOCUMENT, /SENTINEL/);
  assert.doesNotMatch(TEST_ONLY_DOCUMENT, /invoice|dear hiring/i);
  assert.match(TEST_ONLY_DOCUMENT, /not a resume/);
});
