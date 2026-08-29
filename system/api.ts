/**
 * All API routes, mounted at /api by server.ts. Single dev user until real
 * auth is wired (same default the packet allows for preview).
 */
import { Router } from "express";
import { getSql } from "./lib/db.ts";
import { ROLES } from "./lib/roles.ts";
import { WORKFLOW_CHAINS, classifyIntakeDomain } from "./lib/workflows.ts";
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

// Put work on a desk: routes to a chain by domain and starts it.
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
    const chainId = req.body?.chainId ?? classifyIntakeDomain(statement).chainId;
    const started = await startChain(sql, {
      userId: USER,
      chainId,
      requestStatement: statement,
      subjectKind: "statement",
    });
    // Run the first occupation immediately so the desk answers now.
    const driven = await driveWorkflow(sql, USER, started.workflowId);
    res.json({ workflowId: started.workflowId, chainId, firstTask: driven.task, blockedReason: driven.blockedReason });
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
