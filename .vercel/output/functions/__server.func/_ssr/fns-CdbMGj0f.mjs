import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-BZDI_wCj.mjs";
import { i as getSql, t as dbSource } from "./db-Dw_TDOBo.mjs";
import { $ as zoneCensus, A as issueMcpToken, B as makeSolidPng, D as ingestDocument, E as handleJsonRpc, F as listJobs, G as resumeTask, H as putObject, I as listSkills, J as spendCeiling, K as runOccupation, L as listTasks, M as listBatches, N as listContext, P as listDocuments, Q as writeContext, R as listWorkflowPaths, S as ensureWorkspace, U as qualifyMechanicalSkills, W as refineArtifact, Y as startChain, Z as tryMutateOriginal, _ as detectCircularHandoff, a as WORKFLOW_CHAINS, b as driveWorkflow, d as correctContext, f as createArtifact, g as decideApproval, h as dailySpendCents, i as TEST_ONLY_WORDS, j as listAssets, k as ingestPhotoBatch, l as classifyIntakeDomain, m as currentOfLineage, n as ROLES, o as assertActionAllowed, p as createTask, q as sha256Hex, r as TEST_ONLY_DOCUMENT, t as LLM_MODEL, u as containsSecret, v as drainIntakeQueue, w as getObjectBytes, x as enqueueJob, z as llmAvailable } from "./mcp-DLqpv-_h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-CdbMGj0f.js
async function runSyntheticSelfTest(sql, userId) {
	const checks = [];
	const add = (id, pass, detail) => checks.push({
		id,
		pass,
		detail
	});
	await ensureWorkspace(sql, userId);
	add("R-ROL-01", ROLES.length === 40, `${ROLES.length} roles loaded`);
	add("R-WF-COUNT", WORKFLOW_CHAINS.length === 8, `${WORKFLOW_CHAINS.length} chains`);
	const q = await qualifyMechanicalSkills(sql, userId);
	add("R-SKL-01", q.qualified > 0, `qualified ${q.qualified}`);
	const png = makeSolidPng(30, 90, 50, 24, 24);
	const blob = await putObject(sql, {
		userId,
		zone: "originals",
		bytes: png,
		mime: "image/png",
		originalFilename: "TEST_ONLY_geom_green.png",
		immutable: true
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
		source: "selftest"
	});
	const inf = await writeContext(sql, {
		userId,
		kind: "agent_inference",
		body: "TEST_ONLY inference: the speaker might want a lantern catalogued.",
		author: "role:1",
		source: "selftest"
	});
	add("R-CTX-01", stmt.kind !== inf.kind && stmt.author === "user" && inf.author !== "user", "kinds sealed");
	const corr = await correctContext(sql, {
		userId,
		supersedesId: inf.id,
		body: "TEST_ONLY correction: that inference is not a fact.",
		author: "user"
	});
	const current = await currentOfLineage(sql, userId, inf.lineage_id);
	add("R-CTX-02", current?.id === corr.id && current?.kind === "correction", "correction is current");
	add("R-CTX-HIST", Boolean(corr.supersedes_id), "history retained");
	const art = await createArtifact(sql, {
		userId,
		title: "TEST_ONLY draft",
		kind: "writing",
		body: "version 1 TEST_ONLY",
		origin: "user"
	});
	const v2 = await refineArtifact(sql, {
		userId,
		artifactId: art.artifactId,
		body: "version 2 TEST_ONLY",
		origin: "user"
	});
	add("R-ART-LIN", v2.lineageId === art.lineageId && v2.version === 2, `lineage ${v2.lineageId}`);
	const batch = await ingestPhotoBatch(sql, {
		userId,
		sourceType: "selftest",
		purpose: "TEST_ONLY catalog",
		isTestOnly: true,
		files: [
			{
				filename: "TEST_ONLY_a.png",
				mime: "image/png",
				bytes: makeSolidPng(200, 40, 40, 20, 20)
			},
			{
				filename: "TEST_ONLY_a_copy.png",
				mime: "image/png",
				bytes: makeSolidPng(200, 40, 40, 20, 20)
			},
			{
				filename: "TEST_ONLY_b.png",
				mime: "image/png",
				bytes: makeSolidPng(40, 40, 200, 20, 20)
			}
		]
	});
	add("R-PHO-01", batch.originalsPreserved && batch.assets.length === 3, `batch ${batch.batchId}`);
	add("R-PHO-DUP", batch.assets.some((a) => a.duplicate_group), "duplicate grouped");
	add("R-PHO-REV", batch.reviewCount >= 1, `review ${batch.reviewCount}`);
	add("R-PHO-WF", Boolean(batch.workflowId), `workflow ${batch.workflowId}`);
	if (batch.workflowId) await drainIntakeQueue(sql, {
		userId,
		limit: 4
	});
	if (batch.workflowId) {
		const wf = await sql.query(`select current_step, status, chain_id from workflow_instances where id = $1 and user_id = $2`, [batch.workflowId, userId]);
		add("R-WF-PATH", Boolean(wf[0] && wf[0].chain_id === "media" && (wf[0].status === "running" || wf[0].status === "completed")), wf[0] ? `${wf[0].chain_id} step ${wf[0].current_step} ${wf[0].status}` : "missing workflow");
	}
	const doc = await ingestDocument(sql, {
		userId,
		filename: "TEST_ONLY_quokka.txt",
		mime: "text/plain",
		bytes: new Uint8Array(Buffer.from(TEST_ONLY_DOCUMENT)),
		isTestOnly: true
	});
	add("R-DOC-01", doc.checksum_sha256.length === 64 && Boolean(doc.extracted_text?.includes("SENTINEL")), doc.classification ?? "");
	const forbidden = assertActionAllowed(1, "DELETE");
	add("R-NEG-05", !forbidden.ok, forbidden.ok ? "intake deleted" : forbidden.message);
	const circ = detectCircularHandoff([
		7,
		8,
		7
	], 8);
	add("R-RUN-CIRC", !circ.ok, circ.ok ? "circle allowed" : circ.message);
	add("R-GRD-03", containsSecret("GEMINI_API_KEY=abc") && containsSecret("Bearer sk-testtokenvalue"), "secret detector");
	const task = await createTask(sql, {
		userId,
		roleId: 1,
		title: "TEST_ONLY intake",
		requestStatement: TEST_ONLY_WORDS,
		isTestOnly: true
	});
	const run = await runOccupation(sql, {
		userId,
		taskId: task.id,
		action: "ANALYZE"
	});
	if (llmAvailable()) add("R-LLM-01", run.llmUsed || Boolean(run.blockedReason), run.blockedReason ?? "llm ran");
	else {
		add("R-LLM-01", !run.llmUsed && run.task.status === "blocked" && (run.blockedReason ?? "").includes("LLM_UNAVAILABLE"), run.blockedReason ?? "");
		add("R-RUN-02", run.task.status !== "done", "blocked is not done");
	}
	const career = await startChain(sql, {
		userId,
		chainId: "career",
		requestStatement: "TEST_ONLY career chain",
		isTestOnly: true
	});
	add("R-WF-CAREER", career.firstTask.role_id === 7, `first ${career.firstTask.role_id}`);
	const init = await handleJsonRpc(sql, userId, {
		jsonrpc: "2.0",
		id: 1,
		method: "initialize"
	});
	add("R-MCP-01", "result" in init, JSON.stringify(init).slice(0, 80));
	add("R-MCP-TOOLS", "result" in await handleJsonRpc(sql, userId, {
		jsonrpc: "2.0",
		id: 2,
		method: "tools/list"
	}), "tools listed");
	const failed = checks.filter((c) => !c.pass).length;
	return {
		checks,
		passed: checks.length - failed,
		failed
	};
}
var loadHome_createServerFn_handler = createServerRpc({
	id: "61c3a9cf505ce555f011a9cd99afbb4af90e267a1e8cec70f021b4735bc4e5a7",
	name: "loadHome",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadHome.__executeServer(opts));
var loadHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadHome_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureWorkspace(sql, context.userId);
	const [tasks, approvals, batches, documents, health, spend, ceiling, ctx, zones, paths] = await Promise.all([
		listTasks(sql, context.userId),
		sql.query(`select id, action_kind, consequence, status, created_at::text as created_at from approvals
         where user_id = $1 and status = 'pending' order by created_at desc limit 12`, [context.userId]),
		listBatches(sql, context.userId),
		listDocuments(sql, context.userId),
		sql.query(`select payload_json from system_health where user_id = $1`, [context.userId]),
		dailySpendCents(sql, context.userId),
		spendCeiling(sql, context.userId),
		listContext(sql, context.userId, 8),
		zoneCensus(sql, context.userId),
		listWorkflowPaths(sql, context.userId)
	]);
	const waiting = tasks.filter((t) => t.status === "waiting_approval" || t.status === "blocked");
	const active = tasks.filter((t) => t.status === "running" || t.status === "queued");
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
		paths
	};
});
var loadAgents_createServerFn_handler = createServerRpc({
	id: "b21cd5edb8910bdfe12b817bef301c381d23e67f1ae09bd26a96bb531a007c31",
	name: "loadAgents",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadAgents.__executeServer(opts));
var loadAgents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadAgents_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureWorkspace(sql, context.userId);
	const tasks = await listTasks(sql, context.userId);
	const skills = await listSkills(sql, context.userId);
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
			current: tasks.filter((t) => t.role_id === r.id && t.status !== "done").slice(0, 3)
		})),
		skillCounts: {
			qualified: skills.filter((s) => s.status === "qualified").length,
			candidate: skills.filter((s) => s.status === "candidate").length,
			blocked: skills.filter((s) => s.status === "blocked").length
		}
	};
});
var loadWork_createServerFn_handler = createServerRpc({
	id: "49dbb9cc84a771efe63a804262f28f0469037b5be608d2f6202845781efd93b1",
	name: "loadWork",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadWork.__executeServer(opts));
var loadWork = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadWork_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const tasks = await listTasks(sql, context.userId);
	const paths = await listWorkflowPaths(sql, context.userId);
	const approvals = await sql.query(`select id, task_id, action_kind, consequence, status, created_at::text as created_at
       from approvals where user_id = $1 order by created_at desc limit 20`, [context.userId]);
	const outputs = tasks.filter((t) => t.status === "done" || t.status === "handed_off");
	return {
		tasks,
		paths,
		chains: WORKFLOW_CHAINS,
		approvals,
		outputs
	};
});
var loadMedia_createServerFn_handler = createServerRpc({
	id: "a0e3bcf60955ab12a4fea42f06c8f2bca64a6f226b0f8363b016d4371001640b",
	name: "loadMedia",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadMedia.__executeServer(opts));
var loadMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadMedia_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	return {
		batches: await listBatches(sql, context.userId),
		assets: await listAssets(sql, context.userId),
		zones: await zoneCensus(sql, context.userId)
	};
});
var loadDocuments_createServerFn_handler = createServerRpc({
	id: "839a34b74e283c8b886bea7b8bf9fa49b60030bdaf4c78ef936721d23b2cb91a",
	name: "loadDocuments",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadDocuments.__executeServer(opts));
var loadDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadDocuments_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	return { documents: await listDocuments(sql, context.userId) };
});
var loadReview_createServerFn_handler = createServerRpc({
	id: "1ead7bebe510b535aac00ff4b3b9533bc0cfbe5a21b8b0c7f34e89888c9a76cb",
	name: "loadReview",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadReview.__executeServer(opts));
var loadReview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadReview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	return {
		approvals: await sql.query(`select id, task_id, action_kind, consequence, status, decided_note, created_at::text as created_at
       from approvals where user_id = $1 order by created_at desc limit 40`, [context.userId]),
		media: await sql.query(`select id, original_filename, review_state, analysis_model, quality_flag from media_assets
       where user_id = $1 and review_state = 'review' order by created_at desc limit 40`, [context.userId]),
		docs: await sql.query(`select id, original_filename, review_state, classification from documents
       where user_id = $1 and review_state = 'review' order by created_at desc limit 40`, [context.userId]),
		blocked: await sql.query(`select id, title, status, uncertainty from tasks
       where user_id = $1 and status in ('blocked','waiting_approval') order by updated_at desc limit 40`, [context.userId])
	};
});
var loadContext_createServerFn_handler = createServerRpc({
	id: "8f908008f69067becaa467cf1cda9b45b8ac424976d53bc3f7550ac61474c633",
	name: "loadContext",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadContext.__executeServer(opts));
var loadContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadContext_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const records = await listContext(sql, context.userId, 120);
	return {
		records,
		pillars: records.filter((r) => r.source === "voice_pillar" && !r.superseded_by)
	};
});
var loadOutputs_createServerFn_handler = createServerRpc({
	id: "ba43822caf69b3d104990edbffec74bb34b1791094fc04be50b77168013fccba",
	name: "loadOutputs",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadOutputs.__executeServer(opts));
var loadOutputs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadOutputs_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	return {
		outputs: await sql.query(`select id, role_id, title, status, output_json, evidence_json, created_at::text as created_at
       from tasks where user_id = $1 and status in ('done','handed_off') order by created_at desc limit 40`, [context.userId]),
		artifacts: await sql.query(`select a.id, a.title, a.kind, a.lineage_id, a.current_version, a.created_at::text as created_at,
              v.body
       from artifacts a
       left join artifact_versions v
         on v.artifact_id = a.id and v.user_id = a.user_id and v.version_n = a.current_version
       where a.user_id = $1 order by a.created_at desc limit 40`, [context.userId])
	};
});
var loadSystem_createServerFn_handler = createServerRpc({
	id: "1c48f574f87ad3548a64672122efa9570b10da1617e5fb73a3540da9b16c66ff",
	name: "loadSystem",
	filename: "src/lib/os/fns.ts"
}, (opts) => loadSystem.__executeServer(opts));
var loadSystem = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadSystem_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureWorkspace(sql, context.userId);
	const health = await sql.query(`select payload_json, updated_at::text as updated_at from system_health where user_id = $1`, [context.userId]);
	const errors = await sql.query(`select id, kind, body, created_at::text as created_at from task_events
       where user_id = $1 and kind in ('blocked','error') order by created_at desc limit 20`, [context.userId]);
	const spend = await dailySpendCents(sql, context.userId);
	const ceiling = await spendCeiling(sql, context.userId);
	const zones = await zoneCensus(sql, context.userId);
	const paths = await listWorkflowPaths(sql, context.userId);
	const jobs = await listJobs(sql, context.userId, 12);
	const runs = await sql.query(`select id, task_id, role_id, provider, model, prompt_tokens, completion_tokens, cost_cents,
              blocked_reason, created_at::text as created_at
       from agent_runs where user_id = $1 order by created_at desc limit 20`, [context.userId]);
	const runTotals = await sql.query(`select count(*)::int as n, coalesce(sum(cost_cents),0)::real as cost from agent_runs where user_id = $1`, [context.userId]);
	return {
		health: health[0] ?? null,
		runs,
		runTotals: runTotals[0] ?? {
			n: 0,
			cost: 0
		},
		llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
		db: dbSource,
		spend,
		ceiling,
		errors,
		adapters: ["vercel", "node-host"],
		status: "PARTIAL",
		zones,
		paths,
		jobs
	};
});
var submitWords_createServerFn_handler = createServerRpc({
	id: "16507f8bc426157025e34b8f8ad6fdf77c134329ac997343a75f22d46bca30e8",
	name: "submitWords",
	filename: "src/lib/os/fns.ts"
}, (opts) => submitWords.__executeServer(opts));
var submitWords = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(submitWords_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureWorkspace(sql, context.userId);
	const rec = await writeContext(sql, {
		userId: context.userId,
		kind: "processing_aloud",
		body: data.words,
		author: "user",
		source: "talk.words"
	});
	await writeContext(sql, {
		userId: context.userId,
		kind: "user_statement",
		body: data.words,
		author: "user",
		source: "talk.words",
		lineageId: rec.lineage_id
	});
	if (!data.placeOnDesk) return {
		contextId: rec.id,
		listened: true,
		task: null,
		blockedReason: null,
		domain: classifyIntakeDomain(data.words)
	};
	const roleId = data.roleId ?? classifyIntakeDomain(data.words).roleId;
	const task = await createTask(sql, {
		userId: context.userId,
		roleId,
		title: "Desk work",
		requestStatement: data.words
	});
	const run = await runOccupation(sql, {
		userId: context.userId,
		taskId: task.id,
		action: "ANALYZE"
	});
	return {
		contextId: rec.id,
		listened: false,
		task: run.task,
		blockedReason: run.blockedReason,
		domain: classifyIntakeDomain(data.words)
	};
});
var submitCorrection_createServerFn_handler = createServerRpc({
	id: "d777d437ff4236b21d4b8a1cd8d18ccb1a2811222dd2e0b943f967eaed2e65ca",
	name: "submitCorrection",
	filename: "src/lib/os/fns.ts"
}, (opts) => submitCorrection.__executeServer(opts));
var submitCorrection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(submitCorrection_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	return await correctContext(sql, {
		userId: context.userId,
		supersedesId: data.supersedesId,
		body: data.body,
		author: "user"
	});
});
var sealVoicePillar_createServerFn_handler = createServerRpc({
	id: "e7c83328a975ca6e581baf536aee68ab2179c77a1180acae9516ed261d146f30",
	name: "sealVoicePillar",
	filename: "src/lib/os/fns.ts"
}, (opts) => sealVoicePillar.__executeServer(opts));
var sealVoicePillar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sealVoicePillar_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const body = data.body.trim();
	if (!body) throw new Error("EMPTY_VOICE_SAMPLE");
	const existing = await sql.query(`select id, scope from living_context
       where user_id = $1 and source = 'voice_pillar' and superseded_by is null`, [context.userId]);
	const slot = String(data.slot);
	const prior = existing.find((r) => r.scope === slot);
	if (!prior && existing.length >= 3) throw new Error("VOICE_PILLARS_FULL");
	const rec = await writeContext(sql, {
		userId: context.userId,
		kind: "user_statement",
		body,
		author: "user",
		source: "voice_pillar",
		scope: slot,
		permissions: "owner"
	});
	if (prior) await sql.query(`update living_context set superseded_by = $1 where id = $2 and user_id = $3`, [
		rec.id,
		prior.id,
		context.userId
	]);
	return {
		id: rec.id,
		slot: data.slot,
		count: Math.min(3, existing.filter((e) => e.scope !== slot).length + 1)
	};
});
var postApproval_createServerFn_handler = createServerRpc({
	id: "46bf51134ce78b33668719ee7dcf437d3f5ed4ba13c524de8523e1da6319b823",
	name: "postApproval",
	filename: "src/lib/os/fns.ts"
}, (opts) => postApproval.__executeServer(opts));
var postApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postApproval_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	return decideApproval(sql, {
		userId: context.userId,
		...data
	});
});
var postResume_createServerFn_handler = createServerRpc({
	id: "963a868fc0e00f5e51b64a4ead60c1d48439fd948e3cdc97cda63eeb3ec546ef",
	name: "postResume",
	filename: "src/lib/os/fns.ts"
}, (opts) => postResume.__executeServer(opts));
var postResume = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postResume_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	return resumeTask(sql, context.userId, data.taskId, "ANALYZE");
});
var postStartChain_createServerFn_handler = createServerRpc({
	id: "8a37e85ec985d189858e2d8e9ce54a200fedaca4eae363102ae222a560e4455c",
	name: "postStartChain",
	filename: "src/lib/os/fns.ts"
}, (opts) => postStartChain.__executeServer(opts));
var postStartChain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postStartChain_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const started = await startChain(sql, {
		userId: context.userId,
		...data
	});
	const job = await enqueueJob(sql, {
		userId: context.userId,
		kind: "drive_workflow",
		payload: { workflowId: started.workflowId }
	});
	return {
		...started,
		jobId: job.id
	};
});
var postDriveWorkflow_createServerFn_handler = createServerRpc({
	id: "3ec87ce1568187855b0f6d78b34205b7b9cdf6596c1fac4440ad658baf64deef",
	name: "postDriveWorkflow",
	filename: "src/lib/os/fns.ts"
}, (opts) => postDriveWorkflow.__executeServer(opts));
var postDriveWorkflow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postDriveWorkflow_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	return driveWorkflow(sql, context.userId, data.workflowId);
});
var postSelfTest_createServerFn_handler = createServerRpc({
	id: "9dbd7b3d567614fe256f408032ea34664545414bd3e1adcb2f4dee475943f68c",
	name: "postSelfTest",
	filename: "src/lib/os/fns.ts"
}, (opts) => postSelfTest.__executeServer(opts));
var postSelfTest = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(postSelfTest_createServerFn_handler, async ({ context }) => {
	return runSyntheticSelfTest(await getSql(), context.userId);
});
var postQualify_createServerFn_handler = createServerRpc({
	id: "9d570e9ad256269e593fabca6ee6775bd87698190af132fffd9c008a8af64a14",
	name: "postQualify",
	filename: "src/lib/os/fns.ts"
}, (opts) => postQualify.__executeServer(opts));
var postQualify = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(postQualify_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureWorkspace(sql, context.userId);
	return qualifyMechanicalSkills(sql, context.userId);
});
var postMcpToken_createServerFn_handler = createServerRpc({
	id: "5d229e8c07a0d04251625a870c90e170625dc6f4cafa1592f4632a6200ef8f61",
	name: "postMcpToken",
	filename: "src/lib/os/fns.ts"
}, (opts) => postMcpToken.__executeServer(opts));
var postMcpToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postMcpToken_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	return issueMcpToken(sql, context.userId, data.label || "client");
});
var postRunRole_createServerFn_handler = createServerRpc({
	id: "15a572260f3181072141430b95a290dbd8bcaa447a35f973c08e61fda94d25f9",
	name: "postRunRole",
	filename: "src/lib/os/fns.ts"
}, (opts) => postRunRole.__executeServer(opts));
var postRunRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postRunRole_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const task = await createTask(sql, {
		userId: context.userId,
		roleId: data.roleId,
		title: `Work for role ${data.roleId}`,
		requestStatement: data.requestStatement
	});
	return runOccupation(sql, {
		userId: context.userId,
		taskId: task.id,
		action: data.action ?? "ANALYZE"
	});
});
var postRefine_createServerFn_handler = createServerRpc({
	id: "bae63bd1258a5008e9aa479cb1eb8266bca7bed682b7aea91c80f5d20e0ffe26",
	name: "postRefine",
	filename: "src/lib/os/fns.ts"
}, (opts) => postRefine.__executeServer(opts));
var postRefine = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postRefine_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (!data.artifactId) return createArtifact(sql, {
		userId: context.userId,
		title: data.title || "untitled",
		kind: "writing",
		body: data.body,
		origin: "user"
	});
	return refineArtifact(sql, {
		userId: context.userId,
		artifactId: data.artifactId,
		body: data.body,
		origin: "user",
		startOver: data.startOver
	});
});
var ingestViaFn_createServerFn_handler = createServerRpc({
	id: "68b4864f0c3545d6898a5fdc318d88187819f8d15b153bdbe5f9dd3af966555d",
	name: "ingestViaFn",
	filename: "src/lib/os/fns.ts"
}, (opts) => ingestViaFn.__executeServer(opts));
var ingestViaFn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(ingestViaFn_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const bytes = Uint8Array.from(Buffer.from(data.base64, "base64"));
	if (data.kind === "photo") return ingestPhotoBatch(sql, {
		userId: context.userId,
		sourceType: "web_app_fn",
		isTestOnly: data.isTestOnly,
		files: [{
			filename: data.filename,
			mime: data.mime,
			bytes
		}]
	});
	return ingestDocument(sql, {
		userId: context.userId,
		filename: data.filename,
		mime: data.mime,
		bytes,
		isTestOnly: data.isTestOnly
	});
});
//#endregion
export { ingestViaFn_createServerFn_handler, loadAgents_createServerFn_handler, loadContext_createServerFn_handler, loadDocuments_createServerFn_handler, loadHome_createServerFn_handler, loadMedia_createServerFn_handler, loadOutputs_createServerFn_handler, loadReview_createServerFn_handler, loadSystem_createServerFn_handler, loadWork_createServerFn_handler, postApproval_createServerFn_handler, postDriveWorkflow_createServerFn_handler, postMcpToken_createServerFn_handler, postQualify_createServerFn_handler, postRefine_createServerFn_handler, postResume_createServerFn_handler, postRunRole_createServerFn_handler, postSelfTest_createServerFn_handler, postStartChain_createServerFn_handler, sealVoicePillar_createServerFn_handler, submitCorrection_createServerFn_handler, submitWords_createServerFn_handler };
