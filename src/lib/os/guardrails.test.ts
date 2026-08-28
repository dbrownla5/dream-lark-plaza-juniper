import assert from "node:assert/strict";
import test from "node:test";
import {
  assertActionAllowed,
  containsSecret,
  detectCircularHandoff,
  redactSecrets,
  assertNoFabricatedSuccess,
  assertProhibitedSpeech,
} from "./guardrails.ts";

test("unauthorized occupational action is blocked", () => {
  const d = assertActionAllowed(1, "DELETE");
  assert.equal(d.ok, false);
  if (!d.ok) assert.equal(d.code, "ACTION_FORBIDDEN");
  const ok = assertActionAllowed(1, "ANALYZE");
  assert.equal(ok.ok, true);
});

test("diagnostician cannot modify", () => {
  const d = assertActionAllowed(37, "MODIFY");
  assert.equal(d.ok, false);
});

test("circular handoff is blocked", () => {
  const d = detectCircularHandoff([7, 8, 7], 8);
  assert.equal(d.ok, false);
});

test("secrets are detected and redacted", () => {
  assert.equal(containsSecret("XAI_API_KEY=abc"), true);
  assert.equal(containsSecret("Authorization: Bearer abcdefghijklmnop"), true);
  assert.equal(containsSecret("ordinary catalog note"), false);
  assert.match(redactSecrets("password=hunter2"), /REDACTED/);
});

test("blocked runs cannot be marked done", () => {
  const d = assertNoFabricatedSuccess("done", "LLM_UNAVAILABLE");
  assert.equal(d.ok, false);
});

test("paraphrased sale guarantee is refused", () => {
  const d = assertProhibitedSpeech(
    32,
    "Promise the seller this will definitely sell today",
  );
  assert.equal(d.ok, false);
});

test("restating a prohibition in output is not a block", () => {
  const d = assertProhibitedSpeech(34, "I will not strip evidence from the original.", "output");
  assert.equal(d.ok, true);
});

test("asking to strip evidence is blocked", () => {
  const d = assertProhibitedSpeech(34, "strip evidence from this batch", "request");
  assert.equal(d.ok, false);
});
