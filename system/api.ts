/**
 * All API routes, mounted at /api by server.ts. Single dev user until real
 * auth is wired (same default the packet allows for preview).
 */
import { Router } from "express";
import { getSql } from "./lib/db.ts";
import { ROLES } from "./lib/roles.ts";
import { WORKFLOW_CHAINS } from "./lib/workflows.ts";
import { health } from "./lib/workspace.ts";
import { ensureWorkspace, dailySpendCents, spendCeiling } from "./lib/workspace.ts";
import {
  createTask,
  runOccupation,
  decideApproval,
  startChain,
  driveWorkflow,
  listTasks,
  listWorkflowPaths,
} from "./lib/runtime.ts";
import { listContext, writeContext } from "./lib/context.ts";
import { runVerify } from "./lib/verify.ts";
import { handleJsonRpc } from "./lib/mcp.ts";
import busboy from "busboy";
import {
  preserveFile,
  analyzeImage,
  extractDocumentText,
  createBatch,
  listFiles,
  listBatches,
  getFile,
  startBatchWorkflow,
} from "./lib/intake.ts";
import { getObject, storageHealth } from "./lib/storage.ts";
import { sendMessage, listMessages, listThreads, agentDirectory } from "./lib/chat.ts";
import { correctContext } from "./lib/context.ts";

const USER = "dayna";

export const api = Router();

function wrap(fn: (req: any, res: any) => Promise<void>) {
  return (req: any, res: any) => {
    fn(req, res).catch((err) => {
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    });
  };
}

api.get("/health", (_req, res) => {
  res.json(health());
});

api.get(
  "/state",
  wrap(async (_req, res) => {
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    const [tasks, paths, ctx, spend, ceiling, runs, totals, approvals] = await Promise.all([
      listTasks(sql, USER),
      listWorkflowPaths(sql, USER),
      listContext(sql, USER, 10),
      dailySpendCents(sql, USER),
      spendCeiling(sql, USER),
      sql.query(
        `select id, task_id, role_id, provider, model, prompt_tokens, completion_tokens, cost_cents,
                blocked_reason, created_at::text as created_at
         from agent_runs where user_id = $1 order by created_at desc limit 25`,
        [USER],
      ),
      sql.query<{ n: number; cost: number }>(
        `select count(*)::int as n, coalesce(sum(cost_cents),0)::real as cost from agent_runs where user_id = $1`,
        [USER],
      ),
      sql.query(
        `select id, task_id, action_kind, consequence, status, created_at::text as created_at
         from approvals where user_id = $1 and status = 'pending' order by created_at desc limit 12`,
        [USER],
      ),
    ]);
    res.json({
      ...health(),
      roles: ROLES.map((r) => ({ id: r.id, name: r.name, family: r.family, job: r.job })),
      chains: WORKFLOW_CHAINS.map((c) => ({ id: c.id, title: c.title, steps: c.steps.length })),
      tasks,
      paths,
      context: ctx,
      spend,
      ceiling,
      runs,
      runTotals: totals[0] ?? { n: 0, cost: 0 },
      approvals,
    });
  }),
);

// Dayna speaks: her words are preserved as her words; nothing runs yet.
api.post(
  "/words",
  wrap(async (req, res) => {
    const body = String(req.body?.body ?? "").trim();
    if (!body) {
      res.status(400).json({ error: "body is required" });
      return;
    }
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    const record = await writeContext(sql, {
      userId: USER,
      kind: "user_statement",
      body,
      author: "user",
      source: "dashboard",
    });
    res.json({ record });
  }),
);

// Put work on a desk. The chain is Dayna's pick, never inferred. If she has
// not said which kind of work this is, nothing starts — her words are saved and
// she gets asked once, with the list. A wrong guess costs her more than a click.
api.post(
  "/intake",
  wrap(async (req, res) => {
    const statement = String(req.body?.statement ?? "").trim();
    if (!statement) {
      res.status(400).json({ error: "statement is required" });
      return;
    }
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    const chainId = req.body?.chainId ? String(req.body.chainId) : null;

    if (!chainId) {
      const record = await writeContext(sql, {
        userId: USER,
        kind: "user_statement",
        body: statement,
        author: "dayna",
        source: "intake",
      });
      res.json({
        needsChoice: true,
        contextId: record.id,
        question: "Which kind of work is this?",
        choices: WORKFLOW_CHAINS.map((c) => ({ id: c.id, title: c.title })),
        note: "Saved in your words. Nothing has been routed.",
      });
      return;
    }

    const started = await startChain(sql, {
      userId: USER,
      chainId,
      requestStatement: statement,
      subjectKind: "statement",
    });
    const driven = await driveWorkflow(sql, USER, started.workflowId);
    res.json({
      workflowId: started.workflowId,
      chainId,
      firstTask: driven.task,
      blockedReason: driven.blockedReason,
    });
  }),
);

api.post(
  "/tasks",
  wrap(async (req, res) => {
    const { roleId, title, statement } = req.body ?? {};
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    const task = await createTask(sql, {
      userId: USER,
      roleId: Number(roleId),
      title: String(title ?? "Task"),
      requestStatement: String(statement ?? ""),
    });
    const run = await runOccupation(sql, { userId: USER, taskId: task.id, action: "ANALYZE" });
    res.json({ task: run.task, blockedReason: run.blockedReason, rubric: run.rubric });
  }),
);

api.post(
  "/workflows/:id/drive",
  wrap(async (req, res) => {
    const sql = await getSql();
    const result = await driveWorkflow(sql, USER, String(req.params.id));
    res.json(result);
  }),
);

api.post(
  "/approvals/:id",
  wrap(async (req, res) => {
    const sql = await getSql();
    const decided = await decideApproval(sql, {
      userId: USER,
      approvalId: String(req.params.id),
      status: req.body?.approve ? "approved" : "denied",
      note: req.body?.note,
    });
    res.json(decided);
  }),
);

api.get(
  "/verify",
  wrap(async (_req, res) => {
    const sql = await getSql();
    res.json(await runVerify(sql, USER));
  }),
);

// MCP endpoint (JSON-RPC) for AI clients.
api.post(
  "/mcp",
  wrap(async (req, res) => {
    const sql = await getSql();
    res.json(await handleJsonRpc(sql, USER, req.body));
  }),
);


// ---------------------------------------------------------------------------
// Files. The part that did not exist before: Dayna puts something in, and it
// is preserved before anything else is allowed to happen to it.
// ---------------------------------------------------------------------------

type UploadedPart = { name: string; mime: string; bytes: Buffer };

function readMultipart(req: any): Promise<{ files: UploadedPart[]; fields: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const bb = busboy({
      headers: req.headers,
      limits: { fileSize: 60 * 1024 * 1024, files: 200 },
    });
    const files: UploadedPart[] = [];
    const fields: Record<string, string> = {};
    let truncated = false;

    bb.on("field", (name: string, value: string) => {
      fields[name] = value;
    });
    bb.on("file", (_field: string, stream: any, info: any) => {
      const chunks: Buffer[] = [];
      stream.on("data", (c: Buffer) => chunks.push(c));
      stream.on("limit", () => {
        truncated = true;
      });
      stream.on("end", () => {
        if (!truncated && info.filename) {
          files.push({
            name: info.filename,
            mime: info.mimeType || "application/octet-stream",
            bytes: Buffer.concat(chunks),
          });
        }
      });
    });
    bb.on("error", reject);
    bb.on("close", () => {
      if (truncated) {
        reject(new Error("A file exceeded the 60MB limit and was NOT stored. Nothing was partially saved."));
        return;
      }
      resolve({ files, fields });
    });
    req.pipe(bb);
  });
}

api.post(
  "/upload",
  wrap(async (req, res) => {
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    const { files, fields } = await readMultipart(req);
    if (!files.length) {
      res.status(400).json({ error: "No files arrived." });
      return;
    }

    // The page Dayna dropped on decides the domain. There is no global router
    // guessing what she meant.
    const surface = String(fields.surface ?? "photos");
    const label =
      String(fields.label ?? "").trim() ||
      `${surface === "documents" ? "Documents" : "Photos"} ${new Date().toLocaleString("en-US")}`;
    const batch = await createBatch(sql, {
      userId: USER,
      label,
      kind: surface === "documents" ? "document" : "photo",
      note: String(fields.note ?? "") || undefined,
    });

    const preserved = [];
    for (const f of files) {
      const { file, duplicateOf, backend } = await preserveFile(sql, {
        userId: USER,
        batchId: batch.id,
        originalName: f.name,
        mime: f.mime,
        bytes: f.bytes,
      });
      preserved.push({ file, duplicateOf, backend, bytes: f.bytes });
    }

    res.json({
      batchId: batch.id,
      label: batch.label,
      preserved: preserved.map((p) => ({
        ...p.file,
        duplicateOf: p.duplicateOf,
        backend: p.backend,
      })),
      note: "Originals are stored. Analysis runs next and does not change them.",
    });

    // Analysis after the response: preservation is the promise, analysis is the
    // follow-on. A failure here leaves the file preserved and visible in review.
    for (const p of preserved) {
      if (p.file.status === "failed" || p.duplicateOf) continue;
      try {
        if (p.file.kind === "image") {
          await analyzeImage(sql, USER, p.file, p.bytes);
        } else if (p.file.kind === "document") {
          await extractDocumentText(sql, USER, p.file, p.bytes);
        }
      } catch (err) {
        await sql.query(
          `update files set status = 'review', failure_reason = $2, updated_at = now() where id = $1`,
          [p.file.id, err instanceof Error ? err.message : String(err)],
        );
      }
    }
  }),
);

api.get(
  "/files",
  wrap(async (req, res) => {
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    const [files, batches, storage] = await Promise.all([
      listFiles(sql, USER, {
        kind: req.query.kind ? String(req.query.kind) : undefined,
        batchId: req.query.batch ? String(req.query.batch) : undefined,
      }),
      listBatches(sql, USER),
      storageHealth(),
    ]);
    res.json({ files, batches, storage });
  }),
);

// The bytes themselves, so a photo on the Photos page is her actual photo.
api.get(
  "/files/:id/bytes",
  wrap(async (req, res) => {
    const sql = await getSql();
    const file = await getFile(sql, USER, String(req.params.id));
    if (!file || !file.uri) {
      res.status(404).json({ error: "Not found." });
      return;
    }
    const obj = await getObject(sql, file.uri, USER);
    if (!obj) {
      res.status(410).json({ error: "The original could not be read back from storage." });
      return;
    }
    res.setHeader("Content-Type", obj.mime || file.mime);
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.send(obj.bytes);
  }),
);

// Start the workflow for a batch — from the page it belongs to.
api.post(
  "/batches/:id/start",
  wrap(async (req, res) => {
    const sql = await getSql();
    const chainId = String(req.body?.chainId ?? "media");
    const workflowId = await startBatchWorkflow(sql, {
      userId: USER,
      batchId: String(req.params.id),
      chainId,
      statement: String(req.body?.statement ?? "Work this batch."),
    });
    const driven = await driveWorkflow(sql, USER, workflowId);
    res.json({ workflowId, chainId, task: driven.task, blockedReason: driven.blockedReason });
  }),
);

// ---------------------------------------------------------------------------
// Chat — the ordinary page, and each agent's own.
// ---------------------------------------------------------------------------

api.get("/agents", (_req, res) => {
  res.json({ agents: agentDirectory() });
});

api.get(
  "/threads",
  wrap(async (_req, res) => {
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    res.json({ threads: await listThreads(sql, USER) });
  }),
);

api.get(
  "/chat/:threadId",
  wrap(async (req, res) => {
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    res.json({ messages: await listMessages(sql, USER, String(req.params.threadId)) });
  }),
);

api.post(
  "/chat/:threadId",
  wrap(async (req, res) => {
    const body = String(req.body?.body ?? "").trim();
    if (!body) {
      res.status(400).json({ error: "Say something first." });
      return;
    }
    const threadId = String(req.params.threadId);
    const match = /^role:(\d+)$/.exec(threadId);
    const roleId = match ? Number(match[1]) : null;
    if (roleId !== null && (roleId < 1 || roleId > 40)) {
      res.status(404).json({ error: "No such agent." });
      return;
    }
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    res.json(await sendMessage(sql, { userId: USER, threadId, roleId, body }));
  }),
);

// Dayna corrects the system. History is kept; the correction supersedes.
api.post(
  "/context/:id/correct",
  wrap(async (req, res) => {
    const body = String(req.body?.body ?? "").trim();
    if (!body) {
      res.status(400).json({ error: "A correction needs a body." });
      return;
    }
    const sql = await getSql();
    res.json(
      await correctContext(sql, {
        userId: USER,
        supersedesId: String(req.params.id),
        body,
        author: "dayna",
      }),
    );
  }),
);

api.get(
  "/context",
  wrap(async (_req, res) => {
    const sql = await getSql();
    await ensureWorkspace(sql, USER);
    res.json({ context: await listContext(sql, USER, 120) });
  }),
);

