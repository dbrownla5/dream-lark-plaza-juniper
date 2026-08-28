import assert from "node:assert/strict";
import test from "node:test";
import { WORKFLOW_CHAINS, classifyIntakeDomain, getChain } from "./workflows.ts";

test("required domain chains exist and do not collapse occupations", () => {
  const ids = WORKFLOW_CHAINS.map((c) => c.id);
  for (const id of ["career", "writing", "business", "financial", "resale", "media", "technical", "forensic"]) {
    assert.ok(ids.includes(id), id);
  }
  const resale = getChain("resale");
  const roleIds = resale.steps.map((s) => s.roleId);
  assert.deepEqual(
    [34, 27, 28, 29].every((n) => roleIds.includes(n)),
    true,
  );
  assert.ok(roleIds.includes(31));
  assert.notEqual(roleIds[0], roleIds[1]);
});

test("career chain keeps discovery separate from resume", () => {
  const c = getChain("career");
  assert.equal(c.steps[0].roleId, 7);
  assert.equal(c.steps[1].roleId, 8);
  assert.ok(c.steps.some((s) => s.roleId === 9));
  assert.ok(c.steps.some((s) => s.roleId === 12));
});

test("intake classification is uncertain when evidence is thin", () => {
  const thin = classifyIntakeDomain("TEST_ONLY maybe later");
  assert.equal(thin.uncertain, true);
  const job = classifyIntakeDomain("Find current job listings and check role fit for a resume");
  assert.equal(job.chainId, "career");
});
