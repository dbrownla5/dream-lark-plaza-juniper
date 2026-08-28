import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ROLES } from "./roles.ts";
import { WORKFLOW_CHAINS } from "./workflows.ts";
import { ensureWorkspace, dailySpendCents, spendCeiling } from "./workspace.ts";
import { listContext, writeContext, correctContext, createArtifact, refineArtifact } from "./context.ts";
import { listTasks, createTask, runOccupation, decideApproval, startChain, resumeTask, driveWorkflow, listWorkflowPaths } from "./runtime.ts";
import { enqueueJob, listJobs } from "./queue.ts";
import { listBatches, listAssets, ingestPhotoBatch } from "./photo.ts";
import { listDocuments, ingestDocument } from "./documents.ts";
import { zoneCensus } from "./storage.ts";
import { listSkills, qualifyMechanicalSkills } from "./skills.ts";
import { runSyntheticSelfTest } from "./selftest.ts";
import { issueMcpToken } from "./mcp.ts";
import { classifyIntakeDomain } from "./workflows.ts";
import { llmAvailable, LLM_MODEL } from "./llm.ts";
import { dbSource } from "@/lib/db";
import type { ActionClass } from "./roles.ts";

export const loadHome = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureWorkspace(sql, context.userId);
    const [tasks, approvals, batches, documents, health, spend, ceiling, ctx, zones, paths] = await Promise.all([
      listTasks(sql, context.userId),
      sql.query<{ id: string; action_kind: string; consequence: string; status: string; created_at: string }>(
        `select id, action_kind, consequence, status, created_at::text as created_at from approvals
         where user_id = $1 and status = 'pending' order by created_at desc limit 12`,
        [context.userId],
      ),
      listBatches(sql, context.userId),
      listDocuments(sql, context.userId),
      sql.query<{ payload_json: string }>(`select payload_json from system_health where user_id = $1`, [
        context.userId,
      ]),
      dailySpendCents(sql, context.userId),
      spendCeiling(sql, context.userId),
      listContext(sql, context.userId, 8),
      zoneCensus(sql, context.userId),
      listWorkflowPaths(sql, context.userId),
    ]);
    const waiting = tasks.filter((t) => t.status === "waiting_approval" || t.status === "blocked");
    const active = tasks.filter((t) => t.status === "running" || t.status === "queued" || t.status === "handed_off");
    const done = tasks.filter((t) => t.status === "done" || t.status === "handed_off").slice(0, 6);
    return {
      userId: context.userId,
      llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
      db: dbSource,
      spend,
      ceiling,
      waiting,
      active,
      done,
      approvals,
      batches,
      documents,
      context: ctx,
      health: health[0]?.payload_json ?? null,
      roleCount: ROLES.length,
      zones,
      paths,
    };
  });

export const loadAgents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureWorkspace(sql, context.userId);
    const tasks = await listTasks(sql, context.userId);
    const skills = await listSkills(sql);
    return {
      roles: ROLES.map((r) => ({
        id: r.id,
        name: r.name,
        family: r.family,
        job: r.job,
        inScope: r.inScope,
        outOfScope: r.outOfScope,
        prohibitions: r.prohibitions,
        requiredSkills: r.requiredSkills,
        allowedActions: r.allowedActions,
        current: tasks.filter((t) => t.role_id === r.id && t.status !== "done").slice(0, 3),
      })),
      skillCounts: {
        qualified: skills.filter((s) => s.status === "qualified").length,
        candidate: skills.filter((s) => s.status === "candidate").length,
        blocked: skills.filter((s) => s.status === "blocked").length,
      },
    };
  });

export const loadWork = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const tasks = await listTasks(sql, context.userId);
    const paths = await listWorkflowPaths(sql, context.userId);
    const approvals = await sql.query<{
      id: string; task_id: string | null; action_kind: string; consequence: string; status: string; created_at: string;
    }>(
      `select id, task_id, action_kind, consequence, status, created_at::text as created_at
       from approvals where user_id = $1 order by created_at desc limit 20`,
      [context.userId],
    );
    const outputs = tasks.filter((t) => t.status === "done" || t.status === "handed_off");
    return { tasks, paths, chains: WORKFLOW_CHAINS, approvals, outputs };
  });

export const loadMedia = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return {
      batches: await listBatches(sql, context.userId),
      assets: await listAssets(sql, context.userId),
      zones: await zoneCensus(sql, context.userId),
    };
  });

export const loadDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return { documents: await listDocuments(sql, context.userId) };
  });

export const loadReview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const approvals = await sql.query<{
      id: string; task_id: string | null; action_kind: string; consequence: string; status: string; decided_note: string | null; created_at: string;
    }>(
      `select id, task_id, action_kind, consequence, status, decided_note, created_at::text as created_at
       from approvals where user_id = $1 order by created_at desc limit 40`,
      [context.userId],
    );
    const media = await sql.query<{
      id: string; original_filename: string; review_state: string; analysis_model: string | null; quality_flag: string | null;
    }>(
      `select id, original_filename, review_state, analysis_model, quality_flag from media_assets
       where user_id = $1 and review_state = 'review' order by created_at desc limit 40`,
      [context.userId],
    );
    const docs = await sql.query<{
      id: string; original_filename: string; review_state: string; classification: string | null;
    }>(
      `select id, original_filename, review_state, classification from documents
       where user_id = $1 and review_state = 'review' order by created_at desc limit 40`,
      [context.userId],
    );
    const blocked = await sql.query<{
      id: string; title: string; status: string; uncertainty: string | null;
    }>(
      `select id, title, status, uncertainty from tasks
       where user_id = $1 and status in ('blocked','waiting_approval') order by updated_at desc limit 40`,
      [context.userId],
    );
    return { approvals, media, docs, blocked };
  });

export const loadContext = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const records = await listContext(sql, context.userId, 120);
    const pillars = records.filter((r) => r.source === "voice_pillar" && !r.superseded_by);
    return { records, pillars };
  });

export const loadOutputs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const outputs = await sql.query<{
      id: string; role_id: number; title: string; status: string; output_json: string | null; evidence_json: string | null; created_at: string;
    }>(
      `select id, role_id, title, status, output_json, evidence_json, created_at::text as created_at
       from tasks where user_id = $1 and status in ('done','handed_off') order by created_at desc limit 40`,
      [context.userId],
    );
    const artifacts = await sql.query<{
      id: string; title: string; kind: string; lineage_id: string; current_version: number; created_at: string;
    }>(
      `select id, title, kind, lineage_id, current_version, created_at::text as created_at
       from artifacts where user_id = $1 order by created_at desc limit 40`,
      [context.userId],
    );
    return { outputs, artifacts };
  });

export const loadSystem = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureWorkspace(sql, context.userId);
    const health = await sql.query<{ payload_json: string; updated_at: string }>(
      `select payload_json, updated_at::text as updated_at from system_health where user_id = $1`,
      [context.userId],
    );
    const errors = await sql.query<{ id: string; kind: string; body: string | null; created_at: string }>(
      `select id, kind, body, created_at::text as created_at from task_events
       where user_id = $1 and kind in ('blocked','error') order by created_at desc limit 20`,
      [context.userId],
    );
    const spend = await dailySpendCents(sql, context.userId);
    const ceiling = await spendCeiling(sql, context.userId);
    const zones = await zoneCensus(sql, context.userId);
    const paths = await listWorkflowPaths(sql, context.userId);
    const jobs = await listJobs(sql, context.userId, 12);
    return {
      health: health[0] ?? null,
      llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
      db: dbSource,
      spend,
      ceiling,
      errors,
      adapters: ["vercel", "node-host"],
      status: "PARTIAL",
      zones,
      paths,
      jobs,
    };
  });

export const submitWords = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { words: string; startOver?: boolean; artifactId?: string; placeOnDesk?: boolean; roleId?: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureWorkspace(sql, context.userId);
    const rec = await writeContext(sql, {
      userId: context.userId,
      kind: "processing_aloud",
      body: data.words,
      author: "user",
      source: "talk.words",
    });
    await writeContext(sql, {
      userId: context.userId,
      kind: "user_statement",
      body: data.words,
      author: "user",
      source: "talk.words",
      lineageId: rec.lineage_id,
    });
    if (!data.placeOnDesk) {
      return {
        contextId: rec.id,
        listened: true,
        task: null,
        blockedReason: null,
        domain: classifyIntakeDomain(data.words),
      };
    }
    const roleId = data.roleId ?? classifyIntakeDomain(data.words).roleId;
    const task = await createTask(sql, {
      userId: context.userId,
      roleId,
      title: "Desk work",
      requestStatement: data.words,
    });
    const run = await runOccupation(sql, { userId: context.userId, taskId: task.id, action: "ANALYZE" });
    return { contextId: rec.id, listened: false, task: run.task, blockedReason: run.blockedReason, domain: classifyIntakeDomain(data.words) };
  });

export const submitCorrection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { supersedesId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rec = await correctContext(sql, {
      userId: context.userId,
      supersedesId: data.supersedesId,
      body: data.body,
      author: "user",
    });
    return rec;
  });

export const sealVoicePillar = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slot: 1 | 2 | 3; body: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const body = data.body.trim();
    if (!body) throw new Error("EMPTY_VOICE_SAMPLE");
    const existing = await sql.query<{ id: string; scope: string | null }>(
      `select id, scope from living_context
       where user_id = $1 and source = 'voice_pillar' and superseded_by is null`,
      [context.userId],
    );
    const slot = String(data.slot);
    const prior = existing.find((r) => r.scope === slot);
    if (!prior && existing.length >= 3) {
      throw new Error("VOICE_PILLARS_FULL");
    }
    const rec = await writeContext(sql, {
      userId: context.userId,
      kind: "user_statement",
      body,
      author: "user",
      source: "voice_pillar",
      scope: slot,
      permissions: "owner",
    });
    if (prior) {
      await sql.query(
        `update living_context set superseded_by = $1 where id = $2 and user_id = $3`,
        [rec.id, prior.id, context.userId],
      );
    }
    return { id: rec.id, slot: data.slot, count: Math.min(3, existing.filter((e) => e.scope !== slot).length + 1) };
  });

export const postApproval = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { approvalId: string; status: "approved" | "denied"; note?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return decideApproval(sql, { userId: context.userId, ...data });
  });

export const postResume = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { taskId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return resumeTask(sql, context.userId, data.taskId, "ANALYZE");
  });

export const postStartChain = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { chainId: string; requestStatement: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const started = await startChain(sql, { userId: context.userId, ...data });
    const job = await enqueueJob(sql, {
      userId: context.userId,
      kind: "drive_workflow",
      payload: { workflowId: started.workflowId },
    });
    return { ...started, jobId: job.id };
  });

export const postDriveWorkflow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { workflowId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return driveWorkflow(sql, context.userId, data.workflowId);
  });

export const postSelfTest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return runSyntheticSelfTest(sql, context.userId);
  });

export const postQualify = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureWorkspace(sql, context.userId);
    return qualifyMechanicalSkills(sql);
  });

export const postMcpToken = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { label: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return issueMcpToken(sql, context.userId, data.label || "client");
  });

export const postRunRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { roleId: number; requestStatement: string; action?: ActionClass }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const task = await createTask(sql, {
      userId: context.userId,
      roleId: data.roleId,
      title: `Work for role ${data.roleId}`,
      requestStatement: data.requestStatement,
    });
    return runOccupation(sql, {
      userId: context.userId,
      taskId: task.id,
      action: data.action ?? "ANALYZE",
    });
  });

export const postRefine = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { artifactId?: string; title?: string; body: string; startOver?: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (!data.artifactId) {
      return createArtifact(sql, {
        userId: context.userId,
        title: data.title || "untitled",
        kind: "writing",
        body: data.body,
        origin: "user",
      });
    }
    return refineArtifact(sql, {
      userId: context.userId,
      artifactId: data.artifactId,
      body: data.body,
      origin: "user",
      startOver: data.startOver,
    });
  });

export const ingestViaFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      filename: string;
      mime: string;
      base64: string;
      kind: "photo" | "document";
      isTestOnly?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const bytes = Uint8Array.from(Buffer.from(data.base64, "base64"));
    if (data.kind === "photo") {
      return ingestPhotoBatch(sql, {
        userId: context.userId,
        sourceType: "web_app_fn",
        isTestOnly: data.isTestOnly,
        files: [{ filename: data.filename, mime: data.mime, bytes }],
      });
    }
    return ingestDocument(sql, {
      userId: context.userId,
      filename: data.filename,
      mime: data.mime,
      bytes,
      isTestOnly: data.isTestOnly,
    });
  });
