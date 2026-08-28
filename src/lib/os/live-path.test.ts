import assert from "node:assert/strict";
import test from "node:test";
import { getChain, nextRequiredStep } from "./workflows.ts";

test("media path is custodian then image selection, not a single script", () => {
  const chain = getChain("media");
  assert.equal(chain.steps[0].roleId, 34);
  const next = nextRequiredStep(chain, 0);
  assert.ok(next);
  assert.equal(next.roleId, 35);
});

test("resale path does not skip identification or pricing", () => {
  const chain = getChain("resale");
  assert.equal(chain.steps[0].roleId, 34);
  const afterCustody = nextRequiredStep(chain, 0);
  assert.equal(afterCustody?.roleId, 27);
  const afterIntake = nextRequiredStep(chain, 1);
  assert.equal(afterIntake?.roleId, 28);
  assert.ok(chain.steps.some((s) => s.roleId === 31));
  assert.ok(chain.steps.some((s) => s.roleId === 32));
});

test("writing path stays on one lineage of occupations", () => {
  const chain = getChain("writing");
  assert.equal(chain.steps[0].roleId, 1);
  assert.ok(chain.steps.some((s) => s.roleId === 15));
  assert.ok(chain.steps.some((s) => s.roleId === 3));
});
