import { a as require_jsx_runtime, i as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { T as getRole } from "./mcp-DLqpv-_h.mjs";
import { h as postDriveWorkflow, i as Status, n as Panel, p as loadWork, r as Shell, t as Empty, v as postResume, w as useAuthedQuery, x as postStartChain } from "./use-authed-query-BluSw2KL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-D3Xqz_qo.js
var import_jsx_runtime = require_jsx_runtime();
function WorkPage() {
	const qc = useQueryClient();
	const q = useAuthedQuery("work", () => loadWork());
	const resume = useMutation({
		mutationFn: (taskId) => postResume({ data: { taskId } }),
		onSettled: () => qc.invalidateQueries({ queryKey: ["work"] })
	});
	const start = useMutation({
		mutationFn: (chainId) => postStartChain({ data: {
			chainId,
			requestStatement: "Start this occupational chain from the desk."
		} }),
		onSettled: () => qc.invalidateQueries({ queryKey: ["work"] })
	});
	const drive = useMutation({
		mutationFn: (workflowId) => postDriveWorkflow({ data: { workflowId } }),
		onSettled: () => qc.invalidateQueries({ queryKey: ["work"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Work",
		lede: "Each chain is a path of occupations. Completing one queues the next. Continue runs the current occupation.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Live paths",
					children: q.data.paths.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No path is running. Bring in a file, or open a chain below." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-4",
						children: q.data.paths.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: p.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: p.workflow.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-3 space-y-1 text-sm",
									children: p.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: s.current ? "text-fg" : "text-muted",
										children: [
											s.index + 1,
											". ",
											s.name,
											s.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: s.status })] }) : s.current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-review",
												children: " · current"
											}) : null
										]
									}, `${p.workflow.id}-${s.index}`))
								}),
								p.workflow.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-3 min-h-11 rounded-md bg-primary px-3 py-2 text-sm text-primary-fg",
									onClick: () => drive.mutate(p.workflow.id),
									disabled: drive.isPending,
									children: "Continue this path"
								}) : null,
								drive.data && drive.variables === p.workflow.id && drive.data.blockedReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-review",
									children: drive.data.blockedReason
								}) : null
							]
						}, p.workflow.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Open a chain",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3 sm:grid-cols-2",
						children: q.data.chains.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: c.notes
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-mono text-xs text-muted",
									children: c.steps.map((s) => s.roleId).join(" → ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-3 min-h-11 rounded-md border border-border px-3 py-2 text-sm",
									onClick: () => start.mutate(c.id),
									disabled: start.isPending,
									children: "Start path"
								})
							]
						}, c.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Tasks",
					children: q.data.tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No tasks yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: q.data.tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: t.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-muted",
									children: [roleName(t.role_id), t.step_name ? ` · ${t.step_name}` : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-3",
									children: t.request_statement
								}),
								t.interpretation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 rounded-md bg-bg p-2 text-sm",
									children: t.interpretation
								}) : null,
								t.output_json ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-subtle",
									children: t.output_json
								}) : null,
								t.uncertainty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-review",
									children: t.uncertainty
								}) : null,
								t.status === "blocked" || t.status === "queued" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-3 min-h-11 rounded-md border border-border px-3 py-2",
									onClick: () => resume.mutate(t.id),
									children: "Resume"
								}) : null
							]
						}, t.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Finished outputs",
					children: q.data.outputs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No occupation has finished an output yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: q.data.outputs.slice(0, 12).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: roleName(t.role_id) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: t.status })]
								}),
								t.interpretation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: t.interpretation
								}) : null,
								t.output_json ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-subtle",
									children: t.output_json
								}) : null
							]
						}, t.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Approvals",
					children: q.data.approvals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing waiting on you." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.approvals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							a.action_kind,
							" · ",
							a.consequence,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: a.status })
						] }, a.id))
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading work…"
		})
	});
}
function roleName(id) {
	try {
		return getRole(id).name;
	} catch {
		return `role ${id}`;
	}
}
//#endregion
export { WorkPage as component };
