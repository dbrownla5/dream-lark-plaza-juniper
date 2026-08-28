import type { Sql } from "@/lib/db";
import { sha256Hex } from "./ids.ts";
import { ROLES } from "./roles.ts";
import { WORKFLOW_CHAINS } from "./workflows.ts";
import { listTasks, createTask, decideApproval } from "./runtime.ts";
import { listContext, retrieveForTask, writeContext, correctContext } from "./context.ts";
import { listAssets, listBatches } from "./photo.ts";
import { listDocuments } from "./documents.ts";
import { newId } from "./ids.ts";

export type JsonRpcReq = { jsonrpc?: string; id?: string | number | null; method: string; params?: unknown };
export type JsonRpcRes =
  | { jsonrpc: "2.0"; id: string | number | null; result: unknown }
  | { jsonrpc: "2.0"; id: string | number | null; error: { code: number; message: string } };

const TOOLS = [
  { name: "tasks.list", description: "List tasks for the authorized user", inputSchema: { type: "object", properties: {} } },
  { name: "tasks.create", description: "Create a task for a permanent occupational role", inputSchema: { type: "object", properties: { roleId: { type: "number" }, title: { type: "string" }, requestStatement: { type: "string" } }, required: ["roleId", "title", "requestStatement"] } },
  { name: "tasks.read", description: "Read one task", inputSchema: { type: "object", properties: { taskId: { type: "string" } }, required: ["taskId"] } },
  { name: "context.read", description: "Read current living context", inputSchema: { type: "object", properties: { roleId: { type: "number" } } } },
  { name: "context.correct", description: "Submit a correction that supersedes a record", inputSchema: { type: "object", properties: { supersedesId: { type: "string" }, body: { type: "string" } }, required: ["supersedesId", "body"] } },
  { name: "approvals.list", description: "List pending approvals", inputSchema: { type: "object", properties: {} } },
  { name: "approvals.decide", description: "Approve or deny a pending action", inputSchema: { type: "object", properties: { approvalId: { type: "string" }, status: { type: "string" } }, required: ["approvalId", "status"] } },
  { name: "media.list", description: "List media batches and assets", inputSchema: { type: "object", properties: {} } },
  { name: "documents.list", description: "List documents", inputSchema: { type: "object", properties: {} } },
  { name: "agents.directory", description: "List the 40 permanent occupational roles", inputSchema: { type: "object", properties: {} } },
  { name: "workflows.status", description: "List workflow instances and chain definitions", inputSchema: { type: "object", properties: {} } },
  { name: "outputs.list", description: "List completed task outputs", inputSchema: { type: "object", properties: {} } },
  { name: "health.status", description: "System health", inputSchema: { type: "object", properties: {} } },
] as const;

export async function authenticateMcp(
  sql: Sql,
  opts: { userIdFromSession?: string | null; token?: string | null },
): Promise<string> {
  if (opts.userIdFromSession) return opts.userIdFromSession;
  if (!opts.token) {
    const err = new Error("Unauthorized");
    (err as Error & { status: number }).status = 401;
    throw err;
  }
  const hash = sha256Hex(opts.token);
  const rows = await sql.query<{ user_id: string }>(
    `select user_id from mcp_tokens where token_hash = $1`,
    [hash],
  );
  if (!rows[0]) {
    const err = new Error("Unauthorized");
    (err as Error & { status: number }).status = 401;
    throw err;
  }
  return rows[0].user_id;
}

export async function issueMcpToken(sql: Sql, userId: string, label: string): Promise<{ token: string; id: string }> {
  const token = `mcp_${newId("tok")}`;
  const id = newId("mtk");
  await sql.query(
    `insert into mcp_tokens (id, user_id, token_hash, label) values ($1,$2,$3,$4)`,
    [id, userId, sha256Hex(token), label],
  );
  return { token, id };
}

export async function handleJsonRpc(sql: Sql, userId: string, req: JsonRpcReq): Promise<JsonRpcRes> {
  const id = req.id ?? null;
  try {
    const result = await dispatch(sql, userId, req.method, req.params);
    return { jsonrpc: "2.0", id, result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "error";
    const code = message === "Unauthorized" ? -32001 : -32603;
    return { jsonrpc: "2.0", id, error: { code, message } };
  }
}

async function dispatch(sql: Sql, userId: string, method: string, params: unknown): Promise<unknown> {
  const p = (params ?? {}) as Record<string, unknown>;
  switch (method) {
    case "initialize":
      return {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: "dayna-os-mcp", version: "0.1.0-partial" },
      };
    case "ping":
      return { ok: true };
    case "tools/list":
      return { tools: TOOLS };
    case "tools/call": {
      const name = String(p.name ?? "");
      const args = (p.arguments ?? {}) as Record<string, unknown>;
      const content = await callTool(sql, userId, name, args);
      return { content: [{ type: "text", text: JSON.stringify(content) }] };
    }
    case "resources/list":
      return {
        resources: [
          { uri: "os://agents", name: "Occupational directory" },
          { uri: "os://context", name: "Living context" },
          { uri: "os://workflows", name: "Workflow chains" },
        ],
      };
    default:
      throw new Error(`Unknown method ${method}`);
  }
}

async function callTool(
  sql: Sql,
  userId: string,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "tasks.list":
      return listTasks(sql, userId);
    case "tasks.create":
      return createTask(sql, {
        userId,
        roleId: Number(args.roleId),
        title: String(args.title),
        requestStatement: String(args.requestStatement),
      });
    case "tasks.read": {
      const tasks = await listTasks(sql, userId);
      return tasks.find((t) => t.id === args.taskId) ?? { error: "NOT_FOUND" };
    }
    case "context.read":
      return retrieveForTask(sql, { userId, roleId: Number(args.roleId ?? 1) });
    case "context.correct":
      return correctContext(sql, {
        userId,
        supersedesId: String(args.supersedesId),
        body: String(args.body),
        author: "user",
      });
    case "approvals.list":
      return sql.query(
        `select id, task_id, action_kind, consequence, status, created_at::text as created_at
         from approvals where user_id = $1 order by created_at desc limit 40`,
        [userId],
      );
    case "approvals.decide":
      return decideApproval(sql, {
        userId,
        approvalId: String(args.approvalId),
        status: args.status === "denied" ? "denied" : "approved",
      });
    case "media.list":
      return { batches: await listBatches(sql, userId), assets: await listAssets(sql, userId) };
    case "documents.list":
      return listDocuments(sql, userId);
    case "agents.directory":
      return ROLES.map((r) => ({
        id: r.id,
        name: r.name,
        family: r.family,
        job: r.job,
        inScope: r.inScope,
        outOfScope: r.outOfScope,
      }));
    case "workflows.status": {
      const instances = await sql.query(
        `select id, chain_id, status, current_step, subject_id, created_at::text as created_at
         from workflow_instances where user_id = $1 order by created_at desc limit 40`,
        [userId],
      );
      return { chains: WORKFLOW_CHAINS, instances };
    }
    case "outputs.list":
      return sql.query(
        `select id, role_id, title, status, output_json, created_at::text as created_at
         from tasks where user_id = $1 and status in ('done','handed_off') order by created_at desc limit 40`,
        [userId],
      );
    case "health.status":
      return sql.query(`select payload_json, updated_at::text as updated_at from system_health where user_id = $1`, [
        userId,
      ]);
    default:
      throw new Error(`Unknown tool ${name}`);
  }
}

export function mcpUnauthorized(): JsonRpcRes {
  return { jsonrpc: "2.0", id: null, error: { code: -32001, message: "Unauthorized" } };
}

export { writeContext };
