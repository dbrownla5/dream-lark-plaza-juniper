import type { Sql } from "@/lib/db";
import { makeSolidPng, TEST_ONLY_DOCUMENT, TEST_ONLY_WORDS } from "./fixtures.ts";
import { putObject, tryMutateOriginal, getObjectBytes } from "./storage.ts";
import { sha256Hex } from "./ids.ts";
import { writeContext, correctContext, currentOfLineage, createArtifact, refineArtifact } from "./context.ts";
import { ingestPhotoBatch } from "./photo.ts";
import { ingestDocument } from "./documents.ts";
import { createTask, runOccupation, startChain } from "./runtime.ts";
import { drainIntakeQueue } from "./queue.ts";
import { assertActionAllowed, detectCircularHandoff, containsSecret } from "./guardrails.ts";
import { ROLES } from "./roles.ts";
import { WORKFLOW_CHAINS } from "./workflows.ts";
import { qualifyMechanicalSkills } from "./skills.ts";
import { ensureWorkspace } from "./workspace.ts";
import { llmAvailable } from "./llm.ts";
import { handleJsonRpc } from "./mcp.ts";

export type Check = { id: string; pass: boolean; detail: string };

export async function runSyntheticSelfTest(sql: Sql, userId: string): Promise<{ checks: Check[]; passed: number; failed: number }> {
  const checks: Check[] = [];
  const add = (id: string, pass: boolean, detail: string) => checks.push({ id, pass, detail });

  await ensureWorkspace(sql, userId);
  add("R-ROL-01", ROLES.length === 40, `${ROLES.length} roles loaded`);
  add("R-WF-COUNT", WORKFLOW_CHAINS.length === 8, `${WORKFLOW_CHAINS.length} chains`);

  const q = await qualifyMechanicalSkills(sql);
  add("R-SKL-01", q.qualified > 0, `qualified ${q.qualified}`);

  const png = makeSolidPng(30, 90, 50, 24, 24);
  const blob = await putObject(sql, {
    userId,
    zone: "originals",
    bytes: png,
    mime: "image/png",
    originalFilename: "TEST_ONLY_geom_green.png",
    immutable: true,
  });
  const back = await getObjectBytes(sql, userId, blob.id);
  add("R-STO-01", blob.zone === "originals" && blob.immutable === 1, blob.object_key);
  add("R-STO-02", sha256Hex(back) === blob.checksum_sha256, blob.checksum_sha256);
  let immutable = false;
  try {
    await tryMutateOriginal(sql, userId, blob.id, makeSolidPng(1, 1, 1, 8, 8));
  } catch (e) {
    immutable = e instanceof Error && e.message === "ORIGINAL_IMMUTABLE";
  }
  add("R-NEG-04", immutable, "original overwrite blocked");

  const stmt = await writeContext(sql, {
    userId,
    kind: "user_statement",
    body: TEST_ONLY_WORDS,
    author: "user",
    source: "selftest",
  });
  const inf = await writeContext(sql, {
    userId,
    kind: "agent_inference",
    body: "TEST_ONLY inference: the speaker might want a lantern catalogued.",
    author: "role:1",
    source: "selftest",
  });
  add("R-CTX-01", stmt.kind !== inf.kind && stmt.author === "user" && inf.author !== "user", "kinds sealed");
  const corr = await correctContext(sql, {
    userId,
    supersedesId: inf.id,
    body: "TEST_ONLY correction: that inference is not a fact.",
    author: "user",
  });
  const current = await currentOfLineage(sql, userId, inf.lineage_id);
  add("R-CTX-02", current?.id === corr.id && current?.kind === "correction", "correction is current");
  add("R-CTX-HIST", Boolean(corr.supersedes_id), "history retained");

  const art = await createArtifact(sql, {
    userId,
    title: "TEST_ONLY draft",
    kind: "writing",
    body: "version 1 TEST_ONLY",
    origin: "user",
  });
  const v2 = await refineArtifact(sql, {
    userId,
    artifactId: art.artifactId,
    body: "version 2 TEST_ONLY",
    origin: "user",
  });
  add("R-ART-LIN", v2.lineageId === art.lineageId && v2.version === 2, `lineage ${v2.lineageId}`);

  const batch = await ingestPhotoBatch(sql, {
    userId,
    sourceType: "selftest",
    purpose: "TEST_ONLY catalog",
    isTestOnly: true,
    files: [
      { filename: "TEST_ONLY_a.png", mime: "image/png", bytes: makeSolidPng(200, 40, 40, 20, 20) },
      { filename: "TEST_ONLY_a_copy.png", mime: "image/png", bytes: makeSolidPng(200, 40, 40, 20, 20) },
      { filename: "TEST_ONLY_b.png", mime: "image/png", bytes: makeSolidPng(40, 40, 200, 20, 20) },
    ],
  });
  add("R-PHO-01", batch.originalsPreserved && batch.assets.length === 3, `batch ${batch.batchId}`);
  add("R-PHO-DUP", batch.assets.some((a) => a.duplicate_group), "duplicate grouped");
  add("R-PHO-REV", batch.reviewCount >= 1, `review ${batch.reviewCount}`);
  add("R-PHO-WF", Boolean(batch.workflowId), `workflow ${batch.workflowId}`);
  if (batch.workflowId) {
    await drainIntakeQueue(sql, { userId, limit: 4 });
  }
  if (batch.workflowId) {
    const wf = await sql.query<{ current_step: number; status: string; chain_id: string }>(
      `select current_step, status, chain_id from workflow_instances where id = $1 and user_id = $2`,
      [batch.workflowId, userId],
    );
    add(
      "R-WF-PATH",
      Boolean(wf[0] && wf[0].chain_id === "media" && (wf[0].status === "running" || wf[0].status === "completed")),
      wf[0] ? `${wf[0].chain_id} step ${wf[0].current_step} ${wf[0].status}` : "missing workflow",
    );
  }

  const doc = await ingestDocument(sql, {
    userId,
    filename: "TEST_ONLY_quokka.txt",
    mime: "text/plain",
    bytes: new Uint8Array(Buffer.from(TEST_ONLY_DOCUMENT)),
    isTestOnly: true,
  });
  add("R-DOC-01", doc.checksum_sha256.length === 64 && Boolean(doc.extracted_text?.includes("SENTINEL")), doc.classification ?? "");

  const forbidden = assertActionAllowed(1, "DELETE");
  add("R-NEG-05", !forbidden.ok, forbidden.ok ? "intake deleted" : forbidden.message);
  const circ = detectCircularHandoff([7, 8, 7], 8);
  add("R-RUN-CIRC", !circ.ok, circ.ok ? "circle allowed" : circ.message);
  add("R-GRD-03", containsSecret("XAI_API_KEY=abc") && containsSecret("Bearer sk-testtokenvalue"), "secret detector");

  const task = await createTask(sql, {
    userId,
    roleId: 1,
    title: "TEST_ONLY intake",
    requestStatement: TEST_ONLY_WORDS,
    isTestOnly: true,
  });
  const run = await runOccupation(sql, { userId, taskId: task.id, action: "ANALYZE" });
  if (llmAvailable()) {
    add("R-LLM-01", run.llmUsed || Boolean(run.blockedReason), run.blockedReason ?? "llm ran");
  } else {
    add("R-LLM-01", !run.llmUsed && run.task.status === "blocked" && (run.blockedReason ?? "").includes("LLM_UNAVAILABLE"), run.blockedReason ?? "");
    add("R-RUN-02", run.task.status !== "done", "blocked is not done");
  }

  const career = await startChain(sql, {
    userId,
    chainId: "career",
    requestStatement: "TEST_ONLY career chain",
    isTestOnly: true,
  });
  add("R-WF-CAREER", career.firstTask.role_id === 7, `first ${career.firstTask.role_id}`);

  const init = await handleJsonRpc(sql, userId, { jsonrpc: "2.0", id: 1, method: "initialize" });
  add("R-MCP-01", "result" in init, JSON.stringify(init).slice(0, 80));
  const tools = await handleJsonRpc(sql, userId, { jsonrpc: "2.0", id: 2, method: "tools/list" });
  add("R-MCP-TOOLS", "result" in tools, "tools listed");

  const failed = checks.filter((c) => !c.pass).length;
  return { checks, passed: checks.length - failed, failed };
}
