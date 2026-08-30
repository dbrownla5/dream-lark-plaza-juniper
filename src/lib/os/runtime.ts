import type { Sql } from "@/lib/db";
import { getRole, type ActionClass } from "./roles.ts";
import { emptyRubric, type CycleStep, type RubricPoint, type RubricResult } from "./cycle.ts";
import {
  assertActionAllowed,
  assertApprovalNeeded,
  detectCircularHandoff,
  redactSecrets,
  sanitizeForAgentContext,
  assertProhibitedSpeech,
} from "./guardrails.ts";
import { invokeLlm, llmAvailable } from "./llm.ts";
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

const TASK_COLUMNS = `id, user_id, role_id, title, request_statement, interpretation, status, workflow_id, step_name,
            parent_task_id, package_id, input_json, output_json, evidence_json, uncertainty, recovery_json,
            is_test_only, created_at::text as created_at, updated_at::text as updated_at`;

// Task statuses this engine writes and reads. Every writer and every reader
// uses this one vocabulary — no status is written that nothing consumes, and
// none is consumed that nothing writes.
// queued -> running -> (done | handed_off | waiting_approval | blocked)
export type TaskStatus = "queued" | "running" | "waiting_approval" | "handed_off" | "blocked" | "done";

async function getTask(sql: Sql, userId: string, id: string): Promise<TaskRow | null> {
  const rows = await sql.query<TaskRow>(
    `select ${TASK_COLUMNS} from tasks where id = $1 and user_id = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

async function setTaskStatus(sql: Sql, task: TaskRow, status: TaskStatus): Promise<void> {
  await sql.query(`update tasks set status = $1, updated_at = now() where id = $2 and user_id = $3`, [
    status,
    task.id,
    task.user_id,
  ]);
}

async function recordEvent(sql: Sql, task: TaskRow, kind: string, body: string | null): Promise<void> {
  await sql.query(
    `insert into task_events (id, task_id, user_id, kind, body) values ($1,$2,$3,$4,$5)`,
    [newId("evt"), task.id, task.user_id, kind, body],
  );
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

/**
 * The single ledger writer. Every run — success, block, or approval stop —
 * exits through here, so no path can complete without leaving a durable,
 * readable record: an agent_runs row, a recovery point, and a task event.
 * provider/model are recorded only when a provider was actually contacted.
 */
async function recordRun(
  sql: Sql,
  task: TaskRow,
  opts: {
    cycleStep: CycleStep;
    rubric: RubricResult[];
    blockedReason: string | null;
    llm: { model: string; promptTokens: number; completionTokens: number; costCents: number } | null;
    snapshot: Record<string, unknown>;
  },
): Promise<void> {
  await sql.query(
    `insert into agent_runs (id, task_id, user_id, role_id, cycle_step, provider, model, prompt_tokens, completion_tokens, cost_cents, blocked_reason, rubric_json)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      newId("run"),
      task.id,
      task.user_id,
      task.role_id,
      opts.cycleStep,
      opts.llm ? "gemini" : null,
      opts.llm?.model ?? null,
      opts.llm?.promptTokens ?? null,
      opts.llm?.completionTokens ?? null,
      opts.llm?.costCents ?? null,
      opts.blockedReason,
      JSON.stringify(opts.rubric),
    ],
  );
  await sql.query(
    `insert into recovery_points (id, task_id, user_id, snapshot_json) values ($1,$2,$3,$4)`,
    [newId("rec"), task.id, task.user_id, JSON.stringify(opts.snapshot)],
  );
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
  const mark = (point: RubricPoint, pass: boolean, note: string) => {
    const idx = rubric.findIndex((r) => r.point === point);
    if (idx >= 0) rubric[idx] = { point, pass, note };
  };

  const task = await getTask(sql, opts.userId, opts.taskId);
  if (!task) throw new Error("TASK_NOT_FOUND");
  const role = getRole(task.role_id);

  await setTaskStatus(sql, task, "running");
  await recordEvent(sql, task, "load_role_contract", null);
  mark("occupational_scope", true, `${role.name} contract loaded`);

  /** Blocks the task visibly. Whatever the model already produced is passed
   *  in `salvage` and preserved into evidence — a failed run never erases
   *  material that was generated before the failure. */
  const fail = async (
    reason: string,
    failedPoint: RubricPoint,
    llm: { model: string; promptTokens: number; completionTokens: number; costCents: number } | null,
    salvage?: string,
  ): Promise<RunResult> => {
    mark(failedPoint, false, reason);
    mark("review_failure_behavior", true, "blocked visibly, not silently");
    mark("no_fabricated_success", true, "failure recorded as failure");
    mark("recovery", true, "recovery point snapshotted");
    const salvageNote = salvage ? redactSecrets(salvage).slice(0, 4000) : null;
    await sql.query(
      `update tasks set status = 'blocked', uncertainty = $1, recovery_json = $2,
              evidence_json = coalesce(evidence_json, $3), updated_at = now()
       where id = $4 and user_id = $5`,
      [
        reason,
        JSON.stringify({ resume: true, reason }),
        salvageNote ? JSON.stringify({ salvaged_model_output: salvageNote }) : null,
        task.id,
        task.user_id,
      ],
    );
    await recordRun(sql, task, {
      cycleStep: "fail_visibly_if_blocked",
      rubric,
      blockedReason: reason,
      llm,
      snapshot: { status: "blocked", reason, salvaged: Boolean(salvageNote) },
    });
    await recordEvent(sql, task, "blocked", reason);
    if (task.workflow_id) {
      await sql.query(
        `update workflow_instances set status = 'blocked' where id = $1 and user_id = $2 and status = 'running'`,
        [task.workflow_id, task.user_id],
      );
    }
    const latest = await getTask(sql, task.user_id, task.id);
    return {
      task: latest!,
      blockedReason: reason,
      rubric,
      handoffTaskId: null,
      approvalId: null,
      llmUsed: llm != null,
    };
  };

  // Authority
  const allowed = assertActionAllowed(role.id, opts.action);
  if (!allowed.ok) return fail(allowed.message, "authority_to_act", null);
  const speech = assertProhibitedSpeech(
    role.id,
    `${task.request_statement}\n${opts.extraInstruction ?? ""}`,
    "request",
  );
  if (!speech.ok) return fail(speech.message, "authority_to_act", null);
  mark("authority_to_act", true, `${opts.action} allowed for ${role.name}`);
  await recordEvent(sql, task, "load_task_authority", opts.action);

  // Approval gate
  if (assertApprovalNeeded(role.id, opts.action)) {
    const appr = await sql.query<{ id: string; status: string }>(
      `select id, status from approvals where user_id = $1 and task_id = $2 and action_kind = $3 order by created_at desc limit 1`,
      [opts.userId, task.id, opts.action],
    );
    if (!appr[0] || appr[0].status !== "approved") {
      const approvalId = appr[0]?.id ?? (await createApproval(sql, opts.userId, task.id, opts.action, role));
      await setTaskStatus(sql, task, "waiting_approval");
      mark("completion_criteria", true, "stopped for approval");
      mark("no_fabricated_success", true, "nothing executed before approval");
      await recordRun(sql, task, {
        cycleStep: "stop_for_approval",
        rubric,
        blockedReason: "WAITING_APPROVAL",
        llm: null,
        snapshot: { status: "waiting_approval", approvalId },
      });
      await recordEvent(sql, task, "stop_for_approval", "waiting_approval");
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

  // Living context — user words separated from inference; other roles'
  // inferences are excluded by the retrieval query itself.
  const ctx = await retrieveForTask(sql, { userId: opts.userId, roleId: role.id });
  const userBits = ctx.filter((c) => c.kind === "user_statement" || c.kind === "correction");
  const inferences = ctx.filter((c) => c.kind === "agent_inference");
  const pillars =
    role.id === 15 || role.id === 14 || role.id === 16 ? await listVoicePillars(sql, opts.userId) : [];
  mark("user_words_vs_inference", true, `${userBits.length} user records kept apart from ${inferences.length} inferences`);
  mark("corrections_treatment", true, "corrections retrieved with user statements");
  mark("qualified_skills_tools", true, "role-scoped retrieval; unqualified tool use blocked at call sites");
  await recordEvent(sql, task, "retrieve_living_context", `${ctx.length} records`);

  const pkg = task.package_id ? await loadPackage(sql, opts.userId, task.package_id) : null;
  const pkgText = pkg ? packagePrompt(pkg) : "";
  const cleaned = sanitizeForAgentContext({
    userStatement: task.request_statement,
    other: inferences.map((c) => c.body).join("\n"),
  });

  // Spend ceiling
  const spent = await dailySpendCents(sql, opts.userId);
  const ceiling = await spendCeiling(sql, opts.userId);
  if (spent >= ceiling) {
    return fail(`SPEND_CEILING ${spent}/${ceiling} cents`, "spend_cost_control", null);
  }
  mark("spend_cost_control", true, `spend ${spent}/${ceiling} cents`);

  // LLM
  if (!llmAvailable()) {
    return fail(
      "LLM_UNAVAILABLE: occupational judgment cannot run. Files and records already written remain.",
      "no_fabricated_success",
      null,
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

  await recordEvent(sql, task, "invoke_llm", null);
  const llm = await invokeLlm({ system, user, maxTokens: 1800, json: true });
  await recordUsage(sql, { userId: opts.userId, kind: "llm", costCents: llm.ok ? llm.costCents : 0 });
  if (!llm.ok) {
    return fail(`${llm.code}: ${llm.error}`, "no_fabricated_success", null);
  }
  const llmUsage = {
    model: llm.model,
    promptTokens: llm.promptTokens,
    completionTokens: llm.completionTokens,
    costCents: llm.costCents,
  };

  // Structured output — validated, with one repair attempt. The raw model
  // text survives into evidence even when parsing fails.
  let parsed: OccupationOutput;
  let repairUsage = { promptTokens: 0, completionTokens: 0, costCents: 0 };
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
    await recordUsage(sql, { userId: opts.userId, kind: "llm", costCents: repair.ok ? repair.costCents : 0 });
    if (repair.ok) {
      repairUsage = {
        promptTokens: repair.promptTokens,
        completionTokens: repair.completionTokens,
        costCents: repair.costCents,
      };
    }
    if (!repair.ok) {
      return fail("STRUCTURED_OUTPUT_INVALID: model reply was not valid JSON", "completion_criteria", llmUsage, llm.text);
    }
    try {
      parsed = parseOccupationOutput(repair.text);
    } catch {
      return fail("STRUCTURED_OUTPUT_INVALID after repair", "completion_criteria", llmUsage, repair.text);
    }
  }
  mark("completion_criteria", true, "structured output validated");
  await recordEvent(sql, task, "validate_structured_output", null);

  const totalUsage = {
    model: llmUsage.model,
    promptTokens: llmUsage.promptTokens + repairUsage.promptTokens,
    completionTokens: llmUsage.completionTokens + repairUsage.completionTokens,
    costCents: llmUsage.costCents + repairUsage.costCents,
  };

  // Output gate — a rejected output is preserved as salvage, not erased.
  const outGate = assertProhibitedSpeech(
    role.id,
    `${parsed.interpretation ?? ""} ${typeof parsed.output === "string" ? parsed.output : JSON.stringify(parsed.output ?? {})}`,
    "output",
  );
  if (!outGate.ok) {
    return fail(outGate.message, "authority_to_act", totalUsage, JSON.stringify(parsed.output ?? parsed.interpretation ?? ""));
  }

  const interpretation = redactSecrets(String(parsed.interpretation ?? ""));

  await writeContext(sql, {
    userId: opts.userId,
    kind: "agent_inference",
    body: interpretation || JSON.stringify(parsed.output ?? {}),
    author: `role:${role.id}`,
    source: `llm:${llm.model}`,
    confidence: parsed.uncertainty ? 0.4 : 0.7,
  });
  await recordEvent(sql, task, "write_context_changes", null);

  const evidence = {
    model: llm.model,
    promptTokens: totalUsage.promptTokens,
    completionTokens: totalUsage.completionTokens,
    contextIds: ctx.map((c) => c.id),
    evidence: parsed.evidence ?? [],
  };
  mark("evidence_quality", Boolean(parsed.evidence && (parsed.evidence as unknown[]).length), `${(parsed.evidence as unknown[] | undefined)?.length ?? 0} evidence items`);
  mark("uncertainty_handling", true, parsed.uncertainty ? `uncertainty declared: ${parsed.uncertainty.slice(0, 120)}` : "no uncertainty declared");
  mark("original_provenance", true, "originals untouched by this run");

  let status: TaskStatus = "done";
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
      return fail(circ.message, "required_handoffs", totalUsage, JSON.stringify(parsed.output ?? ""));
    }
    try {
      getRole(parsed.handoff_role_id);
    } catch {
      return fail(`HANDOFF_UNKNOWN_ROLE:${parsed.handoff_role_id}`, "required_handoffs", totalUsage, JSON.stringify(parsed.output ?? ""));
    }
    const child = await createTask(sql, {
      userId: opts.userId,
      roleId: parsed.handoff_role_id,
      title: `Handoff from ${role.name}`,
      requestStatement: task.request_statement,
      interpretation: `Handoff note: ${parsed.context_note ?? ""}`,
      workflowId: task.workflow_id,
      // Distinct step_name keeps handoff side-tasks out of chain-step
      // identity lookups (chain step names never carry this prefix).
      stepName: `handoff:${role.id}->${parsed.handoff_role_id}`,
      parentTaskId: task.id,
      isTestOnly: task.is_test_only === 1,
      input: {
        fromRoleId: role.id,
        fromTaskId: task.id,
        fromStep: task.step_name,
        interpretation,
        output: parsed.output ?? null,
      },
    });
    handoffTaskId = child.id;
    status = parsed.needs_approval ? status : "handed_off";
    mark("required_handoffs", true, `handoff to role ${parsed.handoff_role_id}`);
    await recordEvent(sql, task, "handoff_if_required", `role ${parsed.handoff_role_id}`);
  } else {
    mark("required_handoffs", true, "no handoff required");
  }

  mark("review_failure_behavior", true, blockedReason ? blockedReason : "completed without failure");
  mark("no_fabricated_success", status !== "done" || !blockedReason, "status agrees with blockers");
  mark("recovery", true, "recovery point snapshotted");

  // Durable task state: output, evidence, uncertainty — written before the
  // ledger row so a crash between the two loses bookkeeping, never work.
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
  await recordEvent(sql, task, "write_task_state", status);

  await recordRun(sql, task, {
    cycleStep: status === "waiting_approval" ? "stop_for_approval" : "write_task_state",
    rubric,
    blockedReason,
    llm: totalUsage,
    snapshot: { status, roleId: role.id, interpretation },
  });

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
    subjectKind?: string | null;
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
    [workflowId, opts.userId, chain.id, opts.subjectId ?? null, opts.subjectKind ?? null],
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
  handoffs: { taskId: string; roleId: number; status: string; title: string }[];
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
          status: t?.status ?? null,
          current: index === wf.current_step && wf.status === "running",
        };
      }),
      // Handoff side-tasks are part of the path, not invisible extras.
      handoffs: tasks
        .filter((x) => x.workflow_id === wf.id && x.step_name?.startsWith("handoff:"))
        .map((x) => ({ taskId: x.id, roleId: x.role_id, status: x.status, title: x.title })),
    };
  });
}

/** Create the next occupation on the chain. Hands it this occupation's output.
 *  Only the task that IS the chain's current step advances the cursor — a
 *  second call for the same step is a no-op, and a handoff side-task can
 *  never move the chain. A blocked chain whose current step completes is
 *  unblocked by that completion. */
export async function advanceAfterComplete(sql: Sql, userId: string, task: TaskRow): Promise<TaskRow | null> {
  if (!task.workflow_id) return null;
  if (task.status !== "done" && task.status !== "handed_off") return null;
  const wf = await getWorkflow(sql, userId, task.workflow_id);
  if (!wf || wf.status === "completed") return null;
  const chain = getChain(wf.chain_id);
  const doneIndex = chain.steps.findIndex((s) => s.name === task.step_name && s.roleId === task.role_id);
  if (doneIndex === -1 || doneIndex !== wf.current_step) return null;
  const nextIndex = doneIndex + 1;
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
    `select ${TASK_COLUMNS}
     from tasks where user_id = $1 and workflow_id = $2 and role_id = $3 and step_name = $4
     order by created_at desc limit 1`,
    [userId, wf.id, next.roleId, next.name],
  );
  await sql.query(
    `update workflow_instances set current_step = $1, status = 'running' where id = $2 and user_id = $3`,
    [nextIndex, wf.id, userId],
  );
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
  // Same identity key as advanceAfterComplete: (workflow, role, step name).
  const rows = await sql.query<TaskRow>(
    `select ${TASK_COLUMNS}
     from tasks where user_id = $1 and workflow_id = $2 and role_id = $3 and step_name = $4
     order by created_at desc limit 1`,
    [userId, wf.id, step.roleId, step.name],
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
    if (r.task.status === "blocked" || r.task.status === "waiting_approval") break;
  }
  return { steps, workflowStatus };
}

export async function listTasks(sql: Sql, userId: string): Promise<TaskRow[]> {
  return sql.query<TaskRow>(
    `select ${TASK_COLUMNS} from tasks where user_id = $1 order by created_at desc limit 80`,
    [userId],
  );
}
