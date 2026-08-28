import assert from "node:assert/strict";
import test from "node:test";
import { ROLES, ROLE_COUNT, getRole, assertExactlyFortyRoles } from "./roles.ts";

test("exactly forty occupational contracts", () => {
  assert.equal(ROLES.length, 40);
  assert.equal(ROLE_COUNT, 40);
  assertExactlyFortyRoles();
  for (let i = 1; i <= 40; i++) {
    const r = getRole(i);
    assert.equal(r.id, i);
    assert.ok(r.name.length > 3);
    assert.ok(r.job.length > 20);
    assert.ok(r.inScope.length > 10);
    assert.ok(r.outOfScope.length > 10);
    assert.ok(r.prohibitions.toLowerCase().includes("may not"));
    assert.ok(r.requiredSkills.length >= 1);
  }
});

test("packet names for roles 14 and 15 are not the older aliases", () => {
  assert.equal(getRole(14).name, "Personal and Difficult-Conversation Specialist");
  assert.equal(getRole(15).name, "Long-Form Writing and Voice Editor");
});

test("roles are occupations with families, not a single generic agent", () => {
  const families = new Set(ROLES.map((r) => r.family));
  assert.ok(families.size >= 6);
  assert.notEqual(getRole(13).name, getRole(14).name);
  assert.equal(getRole(34).family, "media");
  assert.equal(getRole(35).family, "media");
  assert.equal(getRole(34).allowedActions.includes("DELETE"), false);
});
