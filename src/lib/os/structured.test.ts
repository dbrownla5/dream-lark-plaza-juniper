import assert from "node:assert/strict";
import test from "node:test";
import { parseOccupationOutput } from "./structured.ts";

test("parses fenced json and trailing commas", () => {
  const parsed = parseOccupationOutput(`here you go
\`\`\`json
{
  "interpretation": "catalog this TEST_ONLY item",
  "output": {"note": "ok"},
  "evidence": ["photo"],
  "uncertainty": null,
  "handoff_role_id": null,
  "needs_approval": false,
  "approval_action": null,
  "context_note": "none",
}
\`\`\`
`);
  assert.equal(parsed.interpretation, "catalog this TEST_ONLY item");
  assert.equal(parsed.needs_approval, false);
});

test("parses prose wrapped around an object", () => {
  const parsed = parseOccupationOutput(
    'Sure.\n{"interpretation":"listen","output":{},"evidence":[],"uncertainty":"thin","needs_approval":false}\nThanks.',
  );
  assert.equal(parsed.interpretation, "listen");
});

test("rejects text with no object", () => {
  assert.throws(() => parseOccupationOutput("I cannot produce JSON right now."));
});
