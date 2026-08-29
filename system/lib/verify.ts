import type { Sql } from "./db.ts";
import { ROLES } from "./roles.ts";
import { WORKFLOW_CHAINS } from "./workflows.ts";
import { llmAvailable, LLM_MODEL } from "./llm.ts";
import { assertActionAllowed, detectCircularHandoff, containsSecret, assertProhibitedSpeech } from "./guardrails.ts";
import { qualifyMechanicalSkills } from "./skills.ts";
import { ensureWorkspace } from "./workspace.ts";
import { writeContext, correctContext, currentOfLineage, createArtifact, refineArtifact } from "./context.ts";
import { startChain, driveUntilBlocked } from "./runtime.ts";
import { handleJsonRpc } from "./mcp.ts";

export type Check = { id: string; pass: boolean; detail: string };

const TEST_ONLY_WORDS = "TEST_ONLY: catalog the purple lantern. Synthetic check, not real work.";

/** Live acceptance surface. Every check executes real code paths; the chain
 *  checks make real LLM calls when a key is present. */
export async function runVerify(
  sql: Sql,
  userId: string,
): Promise<{ ok: boolean; passed: number; failed: number; checks: Check[] }> {
  const checks: Check[] = [];
  const add = (id: string, pass: boolean, detail: string) => checks.push({ id, pass, detail });
  await ensureWorkspace(sql, userId);

  add("roles", ROLES.length === 40, `${ROLES.length}`);
  add("chains_defined", WORKFLOW_CHAINS.length === 8, WORKFLOW_CHAINS.map((c) => c.id).join(","));
  add("llm", llmAvailable(), llmAvailable() ? LLM_MODEL : "UNAVAILABLE");

  const skills = await qualifyMechanicalSkills(sql, userId);
  add("skills", skills.qualified > 0, `qualified ${skills.qualified}`);

  add("guard_delete", !assertActionAllowed(1, "DELETE").ok, "intake cannot delete");
  add("guard_circle", !detectCircularHandoff([7, 8, 7], 8).ok, "circle blocked");
  add("guard_secret", containsSecret("GEMINI_API_KEY=abc") && containsSecret("XAI_API_KEY=abc"), "secrets detected");
  add("guard_sale", !assertProhibitedSpeech(32, "this is guaranteed to sell").ok, "listing cannot promise a sale");

  const stmt = await writeContext(sql, {
    userId,
    kind: "user_statement",
    body: TEST_ONLY_WORDS,
    author: "user",
    source: "verify",
  });
  const inf = await writeContext(sql, {
    userId,
    kind: "agent_inference",
    body: "TEST_ONLY inference — not a fact.",
    author: "role:1",
    source: "verify",
  });
  const corr = await correctContext(sql, {
    userId,
    supersedesId: inf.id,
    body: "TEST_ONLY correction.",
    author: "user",
  });
  const current = await currentOfLineage(sql, userId, inf.lineage_id);
  add("context_kinds", stmt.kind !== inf.kind, `${stmt.kind} vs ${inf.kind}`);
  add("context_correct", current?.id === corr.id, corr.id);

  const art = await createArtifact(sql, {
    userId,
    title: "TEST_ONLY draft",
    kind: "writing",
    body: "v1",
    origin: "user",
  });
  const v2 = await refineArtifact(sql, { userId, artifactId: art.artifactId, body: "v2", origin: "user" });
  add("artifact_lineage", v2.lineageId === art.lineageId && v2.version === 2, `v${v2.version}`);

  const mcpInit = await handleJsonRpc(sql, userId, { jsonrpc: "2.0", id: 1, method: "initialize" });
  add("mcp_init", "result" in mcpInit, "initialize");
  const mcpTools = await handleJsonRpc(sql, userId, { jsonrpc: "2.0", id: 2, method: "tools/list" });
  add("mcp_tools", "result" in mcpTools, "tools listed");

  for (const chain of WORKFLOW_CHAINS) {
    const started = await startChain(sql, {
      userId,
      chainId: chain.id,
      requestStatement: `TEST_ONLY ${chain.id} path. Synthetic only. Do not invent identity.`,
      isTestOnly: true,
    });
    add(
      `chain_${chain.id}_start`,
      started.firstTask.role_id === chain.steps[0].roleId,
      `role ${started.firstTask.role_id}`,
    );
    if (llmAvailable()) {
      const driven = await driveUntilBlocked(sql, userId, started.workflowId, 1);
      const step = driven.steps[0];
      add(
        `chain_${chain.id}_run`,
        Boolean(step) &&
          (step.status === "done" ||
            step.status === "handed_off" ||
            step.status === "blocked" ||
            step.status === "waiting_approval"),
        step ? `${step.roleId}:${step.status}${step.blockedReason ? ` ${step.blockedReason}` : ""}` : "no step",
      );
    }
  }
  if (!llmAvailable()) add("chain_runs_skipped", false, "LLM unavailable — occupations cannot run");

  const runs = await sql.query<{ n: number }>(
    `select count(*)::int as n from agent_runs where user_id = $1`,
    [userId],
  );
  add("run_ledger", (runs[0]?.n ?? 0) > 0 || !llmAvailable(), `${runs[0]?.n ?? 0} runs recorded`);

  const failed = checks.filter((c) => !c.pass).length;
  return { ok: failed === 0, passed: checks.length - failed, failed, checks };
}
