import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { c as loadSystem, d as postMcpToken, f as postQualify, h as postSelfTest, y as useAuthedQuery } from "./use-authed-query-CFLYtheB.mjs";
import { n as Panel, r as Shell, t as Empty } from "./shell-gISFBP99.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/system-BqqFQNvX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SystemPage() {
	const qc = useQueryClient();
	const q = useAuthedQuery("system", () => loadSystem());
	const [token, setToken] = (0, import_react.useState)(null);
	const selftest = useMutation({
		mutationFn: () => postSelfTest(),
		onSettled: () => qc.invalidateQueries({ queryKey: ["system"] })
	});
	const qualify = useMutation({
		mutationFn: () => postQualify(),
		onSettled: () => qc.invalidateQueries({ queryKey: ["system"] })
	});
	const mint = useMutation({
		mutationFn: () => postMcpToken({ data: { label: "desk-client" } }),
		onSuccess: (r) => setToken(r.token)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "System",
		lede: "Deployment, providers, errors, queues, cost, and synthetic construction checks. Status remains PARTIAL until Stage 15.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Health",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-2 gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: q.data.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Catalog"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: q.data.db
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Model"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: q.data.llm
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Spend"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-mono",
								children: [
									q.data.spend.toFixed(1),
									" / ",
									q.data.ceiling,
									" ¢"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Adapters"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: q.data.adapters.join(", ")
							})
						]
					}), q.data.health?.payload_json ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-x-auto text-xs text-subtle",
						children: q.data.health.payload_json
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Errors",
					children: q.data.errors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No blocked events recorded." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.errors.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: String(e.kind)
							}),
							" ",
							String(e.body)
						] }, String(e.id)))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Construction checks",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Synthetic fixtures only — geometric images and TEST_ONLY text. Never your corpus."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md bg-primary px-4 py-2 text-sm text-primary-fg",
									onClick: () => selftest.mutate(),
									disabled: selftest.isPending,
									children: "Run synthetic checks"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md border border-border px-4 py-2 text-sm",
									onClick: () => qualify.mutate(),
									disabled: qualify.isPending,
									children: "Qualify mechanical skills"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md border border-border px-4 py-2 text-sm",
									onClick: () => mint.mutate(),
									children: "Issue MCP token"
								})
							]
						}),
						selftest.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-1 text-sm",
							children: [selftest.data.checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: c.pass ? "text-ok" : "text-danger",
								children: [
									c.pass ? "pass" : "fail",
									" · ",
									c.id,
									" · ",
									c.detail
								]
							}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "pt-2 text-muted",
								children: [
									selftest.data.passed,
									" passed · ",
									selftest.data.failed,
									" failed"
								]
							})]
						}) : null,
						token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 break-all font-mono text-xs",
							children: ["Token shown once: ", token]
						}) : null
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading system…"
		})
	});
}
//#endregion
export { SystemPage as component };
