import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { m as postRunRole, t as loadAgents, y as useAuthedQuery } from "./use-authed-query-CFLYtheB.mjs";
import { i as Status, n as Panel, r as Shell, t as Empty } from "./shell-gISFBP99.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-CJYQ3odB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgentsPage() {
	const q = useAuthedQuery("agents", () => loadAgents());
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(null);
	const [request, setRequest] = (0, import_react.useState)("");
	const run = useMutation({
		mutationFn: () => postRunRole({ data: {
			roleId: open,
			requestStatement: request
		} }),
		onSettled: () => qc.invalidateQueries({ queryKey: ["agents"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Occupations",
		lede: "Forty permanent occupations from your packet. They are not project-married bots. You pick one. It confirms the contract. Then it works.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Skills qualified ",
					q.data.skillCounts.qualified,
					" · candidate ",
					q.data.skillCounts.candidate,
					" · blocked",
					" ",
					q.data.skillCounts.blocked
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: q.data.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: `${r.id}. ${r.name}`,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: r.family
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: r.job
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-subtle",
							children: ["Out of scope: ", r.outOfScope]
						}),
						r.current.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1 text-sm",
							children: r.current.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								t.title,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: t.status })
							] }, t.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No current bounded work." })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 min-h-11 rounded-md border border-border px-3 py-2 text-sm",
							onClick: () => setOpen(r.id),
							children: "Assign work"
						}),
						open === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										"In scope: ",
										r.inScope,
										". Prohibitions: ",
										r.prohibitions
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm",
									rows: 3,
									value: request,
									onChange: (e) => setRequest(e.target.value),
									placeholder: "Exact request. Your words stay yours."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md bg-primary px-3 py-2 text-sm text-primary-fg",
									onClick: () => run.mutate(),
									disabled: !request.trim() || run.isPending,
									children: "Put it on this desk"
								}),
								run.data?.blockedReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-review",
									children: run.data.blockedReason
								}) : null
							]
						}) : null
					]
				}, r.id))
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading occupations…"
		})
	});
}
//#endregion
export { AgentsPage as component };
