import type { Sql } from "@/lib/db";
import { makeSolidPng, TEST_ONLY_DOCUMENT, TEST_ONLY_WORDS } from "./fixtures.ts";
import { getObjectBytes, tryMutateOriginal, zoneCensus } from "./storage.ts";
import { sha256Hex } from "./ids.ts";
import { writeContext, correctContext, currentOfLineage, createArtifact, refineArtifact } from "./context.ts";
import { ingestPhotoBatch } from "./photo.ts";
import { startChain, driveUntilBlocked, listTasks } from "./runtime.ts";
import { drainIntakeQueue } from "./queue.ts";
import { assertActionAllowed, detectCircularHandoff, containsSecret, assertProhibitedSpeech } from "./guardrails.ts";
import { ROLES } from "./roles.ts";
import { WORKFLOW_CHAINS } from "./workflows.ts";
import { qualifyMechanicalSkills } from "./skills.ts";
import { ensureWorkspace } from "./workspace.ts";
import { handleJsonRpc } from "./mcp.ts";
import { llmAvailable, LLM_MODEL } from "./llm.ts";

export type Check = { id: string; pass: boolean; detail: string };

const MCP_TOOLS = [
  "tasks.list",
  "tasks.create",
  "context.read",
  "approvals.list",
  "media.list",
  "documents.list",
  "agents.directory",
  "workflows.status",
  "outputs.list",
  "health.status",
];

export async function runDeskVerify(
  sql: Sql,
  userId: string,
): Promise<{ ok: boolean; passed: number; failed: number; checks: Check[]; launch: string }> {
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
  add("guard_secret", containsSecret("XAI_API_KEY=abc") && containsSecret("GEMINI_API_KEY=abc"), "secrets detected");
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
  for (const name of MCP_TOOLS) {
    const res = await handleJsonRpc(sql, userId, {
      jsonrpc: "2.0",
      id: name,
      method: "tools/call",
      params: {
        name,
        arguments:
          name === "tasks.create"
            ? { roleId: 1, title: "TEST_ONLY mcp create", requestStatement: TEST_ONLY_WORDS }
            : name === "context.read"
              ? { roleId: 1 }
              : {},
      },
    });
    add(`mcp_${name}`, "result" in res, "result" in res ? "ok" : JSON.stringify(res).slice(0, 120));
  }

  const chainStarts: { id: string; workflowId: string; firstRole: number; packageId: string | null }[] = [];
  for (const chain of WORKFLOW_CHAINS) {
    const started = await startChain(sql, {
      userId,
      chainId: chain.id,
      requestStatement: `TEST_ONLY ${chain.id} path. Synthetic only. Do not invent identity.`,
      isTestOnly: true,
    });
    chainStarts.push({
      id: chain.id,
      workflowId: started.workflowId,
      firstRole: started.firstTask.role_id,
      packageId: started.firstTask.package_id,
    });
    add(
      `chain_${chain.id}_start`,
      started.firstTask.role_id === chain.steps[0].roleId && Boolean(started.firstTask.package_id),
      `role ${started.firstTask.role_id} pkg ${started.firstTask.package_id}`,
    );
  }

  if (llmAvailable()) {
    for (const started of chainStarts) {
      const driven = await driveUntilBlocked(sql, userId, started.workflowId, 1);
      const step = driven.steps[0];
      add(
        `chain_${started.id}_run`,
        Boolean(step) &&
          (step.status === "done" ||
            step.status === "handed_off" ||
            step.status === "blocked" ||
            step.status === "waiting_approval"),
        step ? `${step.roleId}:${step.status}${step.blockedReason ? ` ${step.blockedReason}` : ""}` : "no step",
      );
    }
  } else {
    add("chain_runs_skipped", false, "LLM unavailable — occupations cannot run");
  }

  const batch = await ingestPhotoBatch(sql, {
    userId,
    sourceType: "selftest",
    purpose: "TEST_ONLY catalog",
    isTestOnly: true,
    files: [
      { filename: "TEST_ONLY_a.png", mime: "image/png", bytes: makeSolidPng(200, 40, 40, 20, 20) },
      { filename: "TEST_ONLY_b.png", mime: "image/png", bytes: makeSolidPng(40, 40, 200, 20, 20) },
    ],
  });
  add("photo_originals", batch.originalsPreserved && batch.assets.length === 2, batch.batchId);
  add("photo_workflow", Boolean(batch.workflowId), String(batch.workflowId));
  if (batch.workflowId) {
    await drainIntakeQueue(sql, { userId, limit: 4 });
  }
  if (batch.assets[0]) {
    const bytes = await getObjectBytes(sql, userId, batch.assets[0].blob_id);
    add("photo_bytes", bytes.byteLength > 0, `${bytes.byteLength} bytes`);
    let locked = false;
    try {
      await tryMutateOriginal(sql, userId, batch.assets[0].blob_id, makeSolidPng(1, 1, 1, 8, 8));
    } catch (e) {
      locked = e instanceof Error && e.message === "ORIGINAL_IMMUTABLE";
    }
    add("photo_write_once", locked, "blocked");
  }

  const tasks = await listTasks(sql, userId);
  const handed = tasks.filter((t) => t.parent_task_id && t.input_json && t.input_json.includes("fromTaskId"));
  add("handoff_exists", handed.length >= 1, `${handed.length} tasks received prior output`);
  add("outputs_exist", tasks.some((t) => t.status === "done" && t.output_json), "at least one finished occupation output");

  const zones = await zoneCensus(sql, userId);
  add("zone_originals", (zones.find((z) => z.zone === "originals")?.count ?? 0) >= 1, String(zones.find((z) => z.zone === "originals")?.count ?? 0));
  add("zone_outputs", (zones.find((z) => z.zone === "outputs")?.count ?? 0) >= 1, String(zones.find((z) => z.zone === "outputs")?.count ?? 0));

  const failed = checks.filter((c) => !c.pass).length;
  const launch =
    failed === 0
      ? "PARTIAL — machines connected in preview. Not a business launch: catalog is PGLite, Stage 15 not sealed, identity gate is off."
      : `NOT LAUNCHABLE — ${failed} checks failed.`;
  return { ok: failed === 0, passed: checks.length - failed, failed, checks, launch };
}
