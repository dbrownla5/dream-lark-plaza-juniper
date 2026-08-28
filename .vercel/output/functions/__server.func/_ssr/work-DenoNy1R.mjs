import { a as require_jsx_runtime, i as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { v as getRole } from "./mcp-BrNtE2b3.mjs";
import { g as postStartChain, l as loadWork, p as postResume, y as useAuthedQuery } from "./use-authed-query-CFLYtheB.mjs";
import { i as Status, n as Panel, r as Shell, t as Empty } from "./shell-gISFBP99.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-DenoNy1R.js
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Work",
		lede: "Task stages, current owner, next action, waiting / review / failure / retry.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Workflow chains",
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
								children: "Open chain"
							})
						]
					}, c.id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
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
			})]
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
