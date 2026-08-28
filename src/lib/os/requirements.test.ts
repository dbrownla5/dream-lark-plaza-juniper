import assert from "node:assert/strict";
import test from "node:test";
import { REQUIREMENTS, DEPLOY_ADAPTERS, assertNoLocalhostProduction } from "./requirements.ts";
import { CYCLE_STEPS, RUBRIC_POINTS } from "./cycle.ts";

test("requirement IDs cover the packet surface", () => {
  const ids = REQUIREMENTS.map((r) => r.id);
  for (const id of [
    "R-MCP-01",
    "R-LLM-01",
    "R-ROL-01",
    "R-STO-02",
    "R-PHO-01",
    "R-DOC-01",
    "R-CTX-02",
    "R-NEG-01",
    "R-NEG-04",
    "R-WF-RESALE",
  ]) {
    assert.ok((ids as string[]).includes(id), id);
  }
});

test("two non-cloudflare remote adapters, no localhost production", () => {
  assert.equal(DEPLOY_ADAPTERS.length >= 2, true);
  for (const a of DEPLOY_ADAPTERS) {
    assert.equal(a.cloudflare, false);
    assert.equal(a.localhostProduction, false);
  }
  assert.throws(() => assertNoLocalhostProduction("http://localhost:8080"));
  assert.doesNotThrow(() => assertNoLocalhostProduction("https://example.grok.me"));
});

test("operating cycle is 20 steps and rubric is 14 points", () => {
  assert.equal(CYCLE_STEPS.length, 20);
  assert.equal(RUBRIC_POINTS.length, 14);
});
