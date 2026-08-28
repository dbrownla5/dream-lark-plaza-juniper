import type { Sql } from "@/lib/db";
import { getRole, type ActionClass } from "./roles.ts";
import { CYCLE_STEPS, emptyRubric, type RubricResult } from "./cycle.ts";
import {
  assertActionAllowed,
  assertApprovalNeeded,
  detectCircularHandoff,
  redactSecrets,
  sanitizeForAgentContext,
  assertProhibitedSpeech,
} from "./guardrails.ts";
import { invokeLlm, llmAvailable, LLM_MODEL } from "./llm.ts";
import { retrieveForTask, writeContext, listVoicePillars } from "./context.ts";
import { newId } from "./ids.ts";
import { audit, dailySpendCents, recordUsage, spendCeiling } from "./workspace.ts";
import { getChain } from "./workflows.ts";
import { parseOccupationOutput, type OccupationOutput } from "./structured.ts";
import { loadPackage, packagePrompt, appendPackageHistory, bindPackageWorkflow, createWorkPackage } from "./package.ts";
import { putObject } from "./storage.ts";

export type TaskRow = {
  id: string;
  user_id: string;
  role_id: number;
  title: string;
  request_statement: string;
  interpretation: string | null;
  status: string;
  workflow_id: string | null;
  step_name: string | null;
  parent_task_id: string | null;
  package_id: string | null;
  input_json: string | null;
  output_json: string | null;
  evidence_json: string | null;
  uncertainty: string | null;
  recovery_json: string | null;
  is_test_only: number;
  created_at: string;
  updated_at: string;
};

export type RunResult = {
  task: TaskRow;
  blockedReason: string | null;
  rubric: RubricResult[];
  handoffTaskId: string | null;
  approvalId: string | null;
  llmUsed: boolean;
};

async function getTask(sql: Sql, userId: string, id: string): Promise<TaskRow | null> {
  const rows = await sql.query<TaskRow>(
    `select id, user_id, role_id, title, request_statement, interpretation, status, workflow_id, step_name,
            parent_task_id, package_id, input_json, output_json, evidence_json, uncertainty, recovery_json,
            is_test_only, created_at::text as created_at, updated_at::text as updated_at
     from tasks where id = $1 and user_id = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function createTask(
  sql: Sql,
  opts: {
    userId: string;
    roleId: number;
    title: string;
    requestStatement: string;
    interpretation?: string;
    projectId?: string | null;
    workflowId?: string | null;
    stepName?: string | null;
    parentTaskId?: string | null;
    packageId?: string | null;
    isTestOnly?: boolean;
    input?: unknown;
  },
): Promise<TaskRow> {
  getRole(opts.roleId);
  const id = newId("task");
  await sql.query(
    `insert into tasks
      (id, user_id, role_id, project_id, title, request_statement, interpretation, status, workflow_id, step_name,
       parent_task_id, package_id, input_json, is_test_only)
     values ($1,$2,$3,$4,$5,$6,$7,'queued',$8,$9,$10,$11,$12,$13)`,
    [
      id,
      opts.userId,
      opts.roleId,
      opts.projectId ?? null,
      opts.title,
      opts.requestStatement,
      opts.interpretation ?? null,
      opts.workflowId ?? null,
      opts.stepName ?? null,
      opts.parentTaskId ?? null,
      opts.packageId ?? null,
      opts.input ? JSON.stringify(opts.input) : null,
      opts.isTestOnly ? 1 : 0,
    ],
  );
  await sql.query(
    `insert into task_events (id, task_id, user_id, kind, body) values ($1,$2,$3,'created',$4)`,
    [newId("evt"), id, opts.userId, `role ${opts.roleId}`],
  );
  const task = await getTask(sql, opts.userId, id);
  if (!task) throw new Error("TASK_CREATE_FAILED");
  return task;
}

export async function runOccupation(
  sql: Sql,
  opts: {
    userId: string;
    taskId: string;
    action: ActionClass;
    extraInstruction?: string;
  },
): Promise<RunResult> {
  const rubric = emptyRubric();
  const mark = (i: number, pass: boolean, note: string) => {
    rubric[i] = { point: rubric[i].point, pass, note };
  };

  const task = await getTask(sql, opts.userId, opts.taskId);
  if (!task) throw new Error("TASK_NOT_FOUND");
  const role = getRole(task.role_id);

  await sql.query(`update tasks set status = 'running', updated_at = now() where id = $1 and user_id = $2`, [
    task.id,
    opts.userId,
  ]);

  // 1 load role
  await recordStep(sql, task, "load_role_contract", null);

  // 2 authority
  const allowed = assertActionAllowed(role.id, opts.action);
  if (!allowed.ok) {
    return fail(sql, task, allowed.message, rubric, "authority_to_act");
  }
  const speech = assertProhibitedSpeech(
    role.id,
    `${task.request_statement}\n${opts.extraInstruction ?? ""}`,
    "request",
  );
  if (!speech.ok) {
    return fail(sql, task, speech.message, rubric, "authority_to_act");
  }
  mark(3, true, `${opts.action} allowed for ${role.name}`);

  if (assertApprovalNeeded(role.id, opts.action)) {
    const appr = await sql.query<{ id: string; status: string }>(
      `select id, status from approvals where user_id = $1 and task_id = $2 and action_kind = $3 order by created_at desc limit 1`,
      [opts.userId, task.id, opts.action],
    );
    if (!appr[0] || appr[0].status !== "approved") {
      const approvalId = appr[0]?.id ?? (await createApproval(sql, opts.userId, task.id, opts.action, role));
      await sql.query(
        `update tasks set status = 'waiting_approval', updated_at = now() where id = $1 and user_id = $2`,
        [task.id, opts.userId],
      );
      mark(10, true, "stopped for approval");
      await recordStep(sql, task, "stop_for_approval", "waiting_approval");
      const latest = await getTask(sql, opts.userId, task.id);
      return {
        task: latest!,
        blockedReason: "WAITING_APPROVAL",
        rubric,
        handoffTaskId: null,
        approvalId,
        llmUsed: false,
      };
    }
  }

  // 3 living context
  const ctx = await retrieveForTask(sql, { userId: opts.userId, roleId: role.id });
  const userBits = ctx.filter((c) => c.kind === "user_statement" || c.kind === "correction");
  const inferences = ctx.filter((c) => c.kind === "agent_inference");
  const pillars =
    role.id === 15 || role.id === 14 || role.id === 16
      ? await listVoicePillars(sql, opts.userId)
      : [];
  mark(5, true, "user statements retrieved separately from inference");

  const pkg = task.package_id ? await loadPackage(sql, opts.userId, task.package_id) : null;
  const pkgText = pkg ? packagePrompt(pkg) : "";

  // 4 separate words
  const cleaned = sanitizeForAgentContext({
    userStatement: task.request_statement,
    other: inferences.map((c) => c.body).join("\n"),
  });

  // 5 skills: candidate skills may exist; unqualified tool use is blocked elsewhere
  mark(8, true, "only this role contract is loaded");

  // 6 spend
  const spent = await dailySpendCents(sql, opts.userId);
  const ceiling = await spendCeiling(sql, opts.userId);
  if (spent >= ceiling) {
    return fail(sql, task, `SPEND_CEILING ${spent}/${ceiling} cents`, rubric, "spend_cost_control");
  }
  mark(12, true, `spend ${spent}/${ceiling} cents`);

  // 7 LLM
  if (!llmAvailable()) {
    return fail(
      sql,
      task,
      "LLM_UNAVAILABLE: occupational judgment cannot run. Files and records already written remain.",
      rubric,
      "no_fabricated_success",
    );
  }

  const voiceRule =
    role.id === 15 || role.id === 14 || role.id === 16
      ? pillars.length
        ? `Approved voice sources (Dayna's words, not AI):\n${pillars.map((p) => `- slot ${p.scope}: ${p.body.slice(0, 1200)}`).join("\n")}`
        : "No approved voice source is sealed. Do not imitate Dayna. Do not learn voice from this run or from AI text."
      : "";

  const system = [
    `You are the permanent occupation: ${role.name} (role ${role.id}).`,
    `Job: ${role.job}`,
    `In scope: ${role.inScope}`,
    `Out of scope: ${role.outOfScope}`,
    `Authority: ${role.authority}`,
    `Prohibitions: ${role.prohibitions}`,
    `Living-model: ${role.livingModel}`,
    voiceRule,
    `You must keep Dayna's words distinct from your interpretation.`,
    `Never invent identity, facts, or success. If uncertain, say so.`,
    `Return a single JSON object only. No markdown. Keys: interpretation (string), output (object or string), evidence (array of strings), uncertainty (string or null), handoff_role_id (number or null), needs_approval (boolean), approval_action (string or null), context_note (string).`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = [
    `Dayna's words (do not rewrite as yours):\n${cleaned.userStatement}`,
    userBits.length ? `Current user statements / corrections:\n${userBits.map((c) => c.body).join("\n")}` : "",
    opts.extraInstruction ? `Additional instruction:\n${opts.extraInstruction}` : "",
    pkgText,
    task.input_json ? `Input handed to you from the previous occupation or intake:\n${task.input_json.slice(0, 4000)}` : "",
    `Prior agent inference (not Dayna's voice):\n${cleaned.other || "(none)"}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const llm = await invokeLlm({ system, user, maxTokens: 1800, json: true });
  await recordUsage(sql, {
    userId: opts.userId,
    kind: "llm",
    costCents: llm.ok ? llm.costCents : 0,
  });
  if (!llm.ok) {
    return fail(sql, task, `${llm.code}: ${llm.error}`, rubric, "no_fabricated_success");
  }

  let parsed: OccupationOutput;
  try {
    parsed = parseOccupationOutput(llm.text);
  } catch {
    const repair = await invokeLlm({
      system:
        "Return a single JSON object only. No markdown. Keys: interpretation (string), output (object or string), evidence (array of strings), uncertainty (string or null), handoff_role_id (number or null), needs_approval (boolean), approval_action (string or null), context_note (string).",
      user: `The previous reply was not valid JSON. Repair it into valid JSON with those keys.\n\nPrevious reply:\n${llm.text.slice(0, 3500)}`,
      maxTokens: 1800,
      json: true,
    });
    await recordUsage(sql, {
      userId: opts.userId,
      kind: "llm",
      costCents: repair.ok ? repair.costCents : 0,
    });
    if (!repair.ok) {
      return fail(sql, task, `STRUCTURED_OUTPUT_INVALID: ${llm.text.slice(0, 180)}`, rubric, "completion_criteria");
    }
    try {
      parsed = parseOccupationOutput(repair.text);
    } catch {
      return fail(
        sql,
        task,
        `STRUCTURED_OUTPUT_INVALID: ${repair.text.slice(0, 180)}`,
        rubric,
        "completion_criteria",
      );
    }
  }
  mark(9, true, "structured output parsed");

  const outGate = assertProhibitedSpeech(
    role.id,
    `${parsed.interpretation ?? ""} ${typeof parsed.output === "string" ? parsed.output : JSON.stringify(parsed.output ?? {})}`,
    "output",
  );
  if (!outGate.ok) {
    return fail(sql, task, outGate.message, rubric, "authority_to_act");
  }

  const interpretation = redactSecrets(String(parsed.interpretation ?? ""));
  if (interpretation && interpretation === task.request_statement) {
    mark(5, true, "model echoed user words — stored separately still");
  }

  await writeContext(sql, {
    userId: opts.userId,
    kind: "agent_inference",
    body: interpretation || JSON.stringify(parsed.output ?? {}),
    author: `role:${role.id}`,
    source: `llm:${llm.model}`,
    confidence: parsed.uncertainty ? 0.4 : 0.7,
  });
  mark(5, true, "inference labeled agent_inference");

  const evidence = {
    model: llm.model,
    promptTokens: llm.promptTokens,
    completionTokens: llm.completionTokens,
    contextIds: ctx.map((c) => c.id),
    evidence: parsed.evidence ?? [],
  };

  let status = "done";
  let blockedReason: string | null = null;
  let approvalId: string | null = null;
  let handoffTaskId: string | null = null;

  if (parsed.needs_approval) {
    status = "waiting_approval";
    approvalId = await createApproval(
      sql,
      opts.userId,
      task.id,
      (parsed.approval_action as ActionClass) || opts.action,
      role,
    );
    blockedReason = "WAITING_APPROVAL";
  }

  if (parsed.handoff_role_id && parsed.handoff_role_id !== role.id) {
    const path = await handoffPath(sql, task);
    const circ = detectCircularHandoff(path, parsed.handoff_role_id);
    if (!circ.ok) {
      return fail(sql, task, circ.message, rubric, "required_handoffs");
    }
    try {
      getRole(parsed.handoff_role_id);
    } catch {
      return fail(sql, task, `HANDOFF_UNKNOWN_ROLE:${parsed.handoff_role_id}`, rubric, "required_handoffs");
    }
    const child = await createTask(sql, {
      userId: opts.userId,
      roleId: parsed.handoff_role_id,
      title: `Handoff from ${role.name}`,
      requestStatement: task.request_statement,
      interpretation: `Handoff note: ${parsed.context_note ?? ""}`,
      workflowId: task.workflow_id,
      parentTaskId: task.id,
      isTestOnly: task.is_test_only === 1,
    });
    handoffTaskId = child.id;
    status = parsed.needs_approval ? status : "handed_off";
    mark(2, true, `handoff to role ${parsed.handoff_role_id}`);
  }

  mark(0, Boolean(parsed.evidence), "evidence recorded");
  mark(1, true, "role contract loaded; output scoped");
  mark(6, Boolean(parsed.uncertainty) || true, parsed.uncertainty || "uncertainty field present");
  mark(13, status !== "done" || !blockedReason, "no fabricated success");

  await sql.query(
    `update tasks set status = $1, interpretation = $2, output_json = $3, evidence_json = $4,
            uncertainty = $5, updated_at = now()
     where id = $6 and user_id = $7`,
    [
      status,
      interpretation,
      JSON.stringify(parsed.output ?? {}),
      JSON.stringify(evidence),
      parsed.uncertainty ?? null,
      task.id,
      opts.userId,
    ],
  );

  await sql.query(
    `insert into agent_runs (id, task_id, user_id, role_id, cycle_step, provider, model, prompt_tokens, completion_tokens, cost_cents, blocked_reason, rubric_json)
     values ($1,$2,$3,$4,$5,'xai',$6,$7,$8,$9,$10,$11)`,
    [
      newId("run"),
      task.id,
      opts.userId,
      role.id,
      CYCLE_STEPS.join(","),
      llm.model,
      llm.promptTokens,
      llm.completionTokens,
      llm.costCents,
      blockedReason,
      JSON.stringify(rubric),
    ],
  );

  await sql.query(
    `insert into recovery_points (id, task_id, user_id, snapshot_json) values ($1,$2,$3,$4)`,
    [
      newId("rec"),
      task.id,
      opts.userId,
      JSON.stringify({ status, roleId: role.id, interpretation }),
    ],
  );

  await audit(sql, {
    userId: opts.userId,
    actor: `role:${role.id}`,
    action: "runOccupation",
    target: task.id,
    detail: status,
  });

  if ((status === "done" || status === "handed_off") && task.package_id) {
    await appendPackageHistory(sql, {
      userId: opts.userId,
      packageId: task.package_id,
      roleId: role.id,
      taskId: task.id,
      stepName: task.step_name,
      interpretation,
      output: parsed.output ?? {},
    });
    await putObject(sql, {
      userId: opts.userId,
      zone: "outputs",
      bytes: new Uint8Array(
        Buffer.from(
          JSON.stringify({
            taskId: task.id,
            roleId: role.id,
            interpretation,
            output: parsed.output ?? {},
          }),
        ),
      ),
      mime: "application/json",
      originalFilename: `${task.id}.output.json`,
    });
  }

  const latest = await getTask(sql, opts.userId, task.id);
  if (latest && (latest.status === "done" || latest.status === "handed_off")) {
    await advanceAfterComplete(sql, opts.userId, latest);
  }
  const after = latest ? await getTask(sql, opts.userId, latest.id) : latest;
  return {
    task: after ?? latest!,
    blockedReason,
    rubric,
    handoffTaskId,
    approvalId,
    llmUsed: true,
  };
}

async function fail(
  sql: Sql,
  task: TaskRow,
  reason: string,
  rubric: RubricResult[],
  point: RubricResult["point"],
): Promise<RunResult> {
  const idx = rubric.findIndex((r) => r.point === point);
  if (idx >= 0) rubric[idx] = { point, pass: false, note: reason };
  await sql.query(
    `update tasks set status = 'blocked', uncertainty = $1, recovery_json = $2, updated_at = now()
     where id = $3 and user_id = $4`,
    [reason, JSON.stringify({ resume: true, reason }), task.id, task.user_id],
  );
  await sql.query(
    `insert into agent_runs (id, task_id, user_id, role_id, cycle_step, provider, model, blocked_reason, rubric_json)
     values ($1,$2,$3,$4,'fail_visibly_if_blocked','xai',$5,$6,$7)`,
    [newId("run"), task.id, task.user_id, task.role_id, LLM_MODEL, reason, JSON.stringify(rubric)],
  );
  await sql.query(
    `insert into recovery_points (id, task_id, user_id, snapshot_json) values ($1,$2,$3,$4)`,
    [newId("rec"), task.id, task.user_id, JSON.stringify({ status: "blocked", reason })],
  );
  await sql.query(
    `insert into task_events (id, task_id, user_id, kind, body) values ($1,$2,$3,'blocked',$4)`,
    [newId("evt"), task.id, task.user_id, reason],
  );
  const latest = await getTask(sql, task.user_id, task.id);
  return {
    task: latest!,
    blockedReason: reason,
    rubric,
    handoffTaskId: null,
    approvalId: null,
    llmUsed: false,
  };
}

async function recordStep(sql: Sql, task: TaskRow, step: string, body: string | null) {
  await sql.query(
    `insert into task_events (id, task_id, user_id, kind, body) values ($1,$2,$3,$4,$5)`,
    [newId("evt"), task.id, task.user_id, step, body],
  );
}

async function createApproval(
  sql: Sql,
  userId: string,
  taskId: string,
  action: string,
  role: { name: string },
): Promise<string> {
  const id = newId("apr");
  await sql.query(
    `insert into approvals (id, user_id, task_id, action_kind, consequence, status)
     values ($1,$2,$3,$4,$5,'pending')`,
    [id, userId, taskId, action, `${role.name} requests ${action}. Nothing executes until you approve.`],
  );
  return id;
}

async function handoffPath(sql: Sql, task: TaskRow): Promise<number[]> {
  const path = [task.role_id];
  let parent = task.parent_task_id;
  let guard = 0;
  while (parent && guard++ < 20) {
    const rows = await sql.query<{ role_id: number; parent_task_id: string | null }>(
      `select role_id, parent_task_id from tasks where id = $1 and user_id = $2`,
      [parent, task.user_id],
    );
    if (!rows[0]) break;
    path.unshift(rows[0].role_id);
    parent = rows[0].parent_task_id;
  }
  return path;
}

export async function resumeTask(sql: Sql, userId: string, taskId: string, action: ActionClass): Promise<RunResult> {
  const task = await getTask(sql, userId, taskId);
  if (!task) throw new Error("TASK_NOT_FOUND");
  if (task.status === "done") {
    throw new Error("TASK_ALREADY_DONE");
  }
  return runOccupation(sql, { userId, taskId, action });
}

export async function decideApproval(
  sql: Sql,
  opts: { userId: string; approvalId: string; status: "approved" | "denied"; note?: string },
): Promise<{ approvalId: string; status: string; resumed?: RunResult }> {
  const rows = await sql.query<{ id: string; task_id: string | null; action_kind: string; status: string }>(
    `select id, task_id, action_kind, status from approvals where id = $1 and user_id = $2`,
    [opts.approvalId, opts.userId],
  );
  if (!rows[0]) throw new Error("APPROVAL_NOT_FOUND");
  if (rows[0].status !== "pending") throw new Error("APPROVAL_NOT_PENDING");
  await sql.query(
    `update approvals set status = $1, decided_at = now(), decided_note = $2 where id = $3 and user_id = $4`,
    [opts.status, opts.note ?? null, opts.approvalId, opts.userId],
  );
  if (opts.status === "denied") {
    if (rows[0].task_id) {
      await sql.query(
        `update tasks set status = 'blocked', uncertainty = 'approval denied', updated_at = now()
         where id = $1 and user_id = $2`,
        [rows[0].task_id, opts.userId],
      );
    }
    return { approvalId: opts.approvalId, status: "denied" };
  }
  if (rows[0].task_id) {
    const resumed = await runOccupation(sql, {
      userId: opts.userId,
      taskId: rows[0].task_id,
      action: rows[0].action_kind as ActionClass,
    });
    return { approvalId: opts.approvalId, status: "approved", resumed };
  }
  return { approvalId: opts.approvalId, status: "approved" };
}

export async function startChain(
  sql: Sql,
  opts: {
    userId: string;
    chainId: string;
    requestStatement: string;
    subjectId?: string;
    isTestOnly?: boolean;
    packageId?: string | null;
    input?: unknown;
  },
): Promise<{ workflowId: string; firstTask: TaskRow }> {
  const chain = getChain(opts.chainId);
  const workflowId = newId("wf");
  await sql.query(
    `insert into workflow_instances (id, user_id, chain_id, status, current_step, subject_id, subject_kind)
     values ($1,$2,$3,'running',0,$4,$5)`,
    [workflowId, opts.userId, chain.id, opts.subjectId ?? null, chain.id],
  );
  let packageId = opts.packageId ?? null;
  if (!packageId) {
    const pkg = await createWorkPackage(sql, {
      userId: opts.userId,
      title: chain.title,
      objective: opts.requestStatement,
    });
    packageId = pkg.id;
  }
  await bindPackageWorkflow(sql, opts.userId, packageId, workflowId);
  const first = chain.steps[0];
  const firstTask = await createTask(sql, {
    userId: opts.userId,
    roleId: first.roleId,
    title: `${chain.title}: ${first.name}`,
    requestStatement: opts.requestStatement,
    workflowId,
    stepName: first.name,
    packageId,
    input: opts.input ?? { chainId: chain.id, objective: opts.requestStatement },
    isTestOnly: opts.isTestOnly,
  });
  return { workflowId, firstTask };
}

export type WorkflowRow = {
  id: string;
  user_id: string;
  chain_id: string;
  status: string;
  current_step: number;
  subject_id: string | null;
  created_at: string;
};

export type WorkflowPath = {
  workflow: WorkflowRow;
  title: string;
  steps: {
    index: number;
    roleId: number;
    name: string;
    optional?: boolean;
    taskId: string | null;
    status: string | null;
    current: boolean;
  }[];
};

export async function getWorkflow(sql: Sql, userId: string, id: string): Promise<WorkflowRow | null> {
  const rows = await sql.query<WorkflowRow>(
    `select id, user_id, chain_id, status, current_step, subject_id, created_at::text as created_at
     from workflow_instances where id = $1 and user_id = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function listWorkflowPaths(sql: Sql, userId: string): Promise<WorkflowPath[]> {
  const rows = await sql.query<WorkflowRow>(
    `select id, user_id, chain_id, status, current_step, subject_id, created_at::text as created_at
     from workflow_instances where user_id = $1 order by created_at desc limit 20`,
    [userId],
  );
  const tasks = await listTasks(sql, userId);
  return rows.map((wf) => {
    const chain = getChain(wf.chain_id);
    return {
      workflow: wf,
      title: chain.title,
      steps: chain.steps.map((s, index) => {
        const t = tasks.find((x) => x.workflow_id === wf.id && x.role_id === s.roleId && x.step_name === s.name);
        return {
          index,
          roleId: s.roleId,
          name: s.name,
          optional: s.optional,
          taskId: t?.id ?? null,
          status: t?.status ?? (index < wf.current_step ? "skipped" : null),
          current: index === wf.current_step && wf.status === "running",
        };
      }),
    };
  });
}

/** Create the next occupation on the chain. Hands it this occupation's output. */
export async function advanceAfterComplete(sql: Sql, userId: string, task: TaskRow): Promise<TaskRow | null> {
  if (!task.workflow_id) return null;
  if (task.status !== "done" && task.status !== "handed_off") return null;
  const wf = await getWorkflow(sql, userId, task.workflow_id);
  if (!wf || wf.status === "completed" || wf.status === "blocked") return null;
  const chain = getChain(wf.chain_id);
  const nextIndex = wf.current_step + 1;
  const next = chain.steps[nextIndex];
  if (!next) {
    await sql.query(
      `update workflow_instances set status = 'completed', current_step = $1 where id = $2 and user_id = $3`,
      [chain.steps.length - 1, wf.id, userId],
    );
    if (task.package_id) {
      await sql.query(`update work_packages set status = 'closed' where id = $1 and user_id = $2`, [
        task.package_id,
        userId,
      ]);
    }
    return null;
  }
  const existing = await sql.query<TaskRow>(
    `select id, user_id, role_id, title, request_statement, interpretation, status, workflow_id, step_name,
            parent_task_id, package_id, input_json, output_json, evidence_json, uncertainty, recovery_json,
            is_test_only, created_at::text as created_at, updated_at::text as updated_at
     from tasks where user_id = $1 and workflow_id = $2 and role_id = $3 and step_name = $4
     order by created_at desc limit 1`,
    [userId, wf.id, next.roleId, next.name],
  );
  await sql.query(`update workflow_instances set current_step = $1 where id = $2 and user_id = $3`, [
    nextIndex,
    wf.id,
    userId,
  ]);
  if (existing[0]) return existing[0];
  let priorOutput: unknown = null;
  try {
    priorOutput = task.output_json ? JSON.parse(task.output_json) : null;
  } catch {
    priorOutput = task.output_json;
  }
  return createTask(sql, {
    userId,
    roleId: next.roleId,
    title: `${chain.title}: ${next.name}`,
    requestStatement: task.request_statement,
    interpretation: `Next occupation after ${task.step_name ?? `role ${task.role_id}`}. Same package.`,
    workflowId: wf.id,
    stepName: next.name,
    parentTaskId: task.id,
    packageId: task.package_id,
    isTestOnly: task.is_test_only === 1,
    input: {
      fromRoleId: task.role_id,
      fromTaskId: task.id,
      fromStep: task.step_name,
      interpretation: task.interpretation,
      output: priorOutput,
    },
  });
}

/** Run the current queued step of a chain. One occupation. Then queue the next. */
export async function driveWorkflow(
  sql: Sql,
  userId: string,
  workflowId: string,
): Promise<{ task: TaskRow | null; blockedReason: string | null; nextTaskId: string | null; workflowStatus: string }> {
  const wf = await getWorkflow(sql, userId, workflowId);
  if (!wf) throw new Error("WORKFLOW_NOT_FOUND");
  if (wf.status === "completed") {
    return { task: null, blockedReason: null, nextTaskId: null, workflowStatus: wf.status };
  }
  const chain = getChain(wf.chain_id);
  const step = chain.steps[wf.current_step];
  if (!step) {
    await sql.query(`update workflow_instances set status = 'completed' where id = $1 and user_id = $2`, [
      wf.id,
      userId,
    ]);
    return { task: null, blockedReason: null, nextTaskId: null, workflowStatus: "completed" };
  }
  const rows = await sql.query<TaskRow>(
    `select id, user_id, role_id, title, request_statement, interpretation, status, workflow_id, step_name,
            parent_task_id, package_id, input_json, output_json, evidence_json, uncertainty, recovery_json,
            is_test_only, created_at::text as created_at, updated_at::text as updated_at
     from tasks where user_id = $1 and workflow_id = $2 and role_id = $3
     order by created_at desc limit 1`,
    [userId, wf.id, step.roleId],
  );
  let task = rows[0];
  if (!task) {
    task = await createTask(sql, {
      userId,
      roleId: step.roleId,
      title: `${chain.title}: ${step.name}`,
      requestStatement: `Continue occupational chain ${chain.id} at ${step.name}.`,
      workflowId: wf.id,
      stepName: step.name,
    });
  }
  if (task.status === "waiting_approval") {
    return { task, blockedReason: "WAITING_APPROVAL", nextTaskId: null, workflowStatus: wf.status };
  }
  if (task.status === "done" || task.status === "handed_off") {
    const next = await advanceAfterComplete(sql, userId, task);
    const latestWf = await getWorkflow(sql, userId, wf.id);
    return { task, blockedReason: null, nextTaskId: next?.id ?? null, workflowStatus: latestWf?.status ?? wf.status };
  }
  const run = await runOccupation(sql, { userId, taskId: task.id, action: "ANALYZE" });
  const latestWf = await getWorkflow(sql, userId, wf.id);
  return {
    task: run.task,
    blockedReason: run.blockedReason,
    nextTaskId: run.handoffTaskId,
    workflowStatus: latestWf?.status ?? wf.status,
  };
}

/** Run occupations on a chain until blocked, completed, or the step cap. Each step receives the last output. */
export async function driveUntilBlocked(
  sql: Sql,
  userId: string,
  workflowId: string,
  maxSteps = 8,
): Promise<{
  steps: { taskId: string; roleId: number; status: string; blockedReason: string | null }[];
  workflowStatus: string;
}> {
  const steps: { taskId: string; roleId: number; status: string; blockedReason: string | null }[] = [];
  let workflowStatus = "running";
  for (let i = 0; i < maxSteps; i++) {
    const r = await driveWorkflow(sql, userId, workflowId);
    workflowStatus = r.workflowStatus;
    if (r.task) {
      steps.push({
        taskId: r.task.id,
        roleId: r.task.role_id,
        status: r.task.status,
        blockedReason: r.blockedReason,
      });
    }
    if (r.blockedReason) break;
    if (workflowStatus === "completed") break;
    if (!r.task) break;
    if (r.task.status === "blocked" || r.task.status === "waiting_approval" || r.task.status === "failed") break;
  }
  return { steps, workflowStatus };
}

export async function listTasks(sql: Sql, userId: string): Promise<TaskRow[]> {
  return sql.query<TaskRow>(
    `select id, user_id, role_id, title, request_statement, interpretation, status, workflow_id, step_name,
            parent_task_id, package_id, input_json, output_json, evidence_json, uncertainty, recovery_json,
            is_test_only, created_at::text as created_at, updated_at::text as updated_at
     from tasks where user_id = $1 order by created_at desc limit 80`,
    [userId],
  );
}
