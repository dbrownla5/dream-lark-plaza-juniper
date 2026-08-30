import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as getRole } from "./mcp-DLqpv-_h.mjs";
import { c as loadHome, i as Status, n as Panel, r as Shell, t as Empty, w as useAuthedQuery } from "./use-authed-query-BluSw2KL.mjs";
import { t as IntakeForm } from "./intake-form-D4qJngMD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BobVDiNR.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const q = useAuthedQuery("home", () => loadHome());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		title: "Today",
		lede: "You talk. Occupations wait until you put work on a desk. Files are preserved first.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntakeForm, {})
			}),
			q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Loading the floor…"
			}) : null,
			q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-danger",
				children: q.error.message
			}) : null,
			q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Waiting on you",
						children: q.data.waiting.length === 0 && q.data.approvals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing is waiting on you." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-sm",
							children: [q.data.approvals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.consequence }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/review",
									className: "text-primary",
									children: "Review"
								})]
							}, a.id)), q.data.waiting.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									t.title,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: t.status })
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/work",
									className: "text-primary",
									children: "Open"
								})]
							}, t.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Active work",
						children: q.data.active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No running work. Occupations stay still until you put something on a desk." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: q.data.active.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [roleName(t.role_id), " · "]
								}),
								t.title,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: t.status })
							] }, t.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Last outputs",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/work",
							className: "text-sm text-primary",
							children: "Work"
						}),
						children: q.data.done.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No occupation has finished yet. Put work on a desk under Occupations." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 text-sm",
							children: q.data.done.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: roleName(t.role_id) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: t.status })]
								}), t.interpretation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: t.interpretation
								}) : null]
							}, t.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Memory",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/context",
							className: "text-sm text-primary",
							children: "Open"
						}),
						children: q.data.context.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing sealed yet. Talk above, or drop files under Bring in." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: q.data.context.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted",
								children: c.kind
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2",
								children: c.body
							})] }, c.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "System",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-2 text-sm",
								children: [
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
										children: "Catalog"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono",
										children: q.data.db
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Spend today"
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
										children: "Occupations"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono",
										children: q.data.roleCount
									})
								]
							}),
							q.data.zones ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-mono text-xs text-muted",
								children: [
									"originals ",
									q.data.zones.find((z) => z.zone === "originals")?.count ?? 0,
									" · intake",
									" ",
									q.data.zones.find((z) => z.zone === "intake")?.count ?? 0,
									" · derivatives",
									" ",
									q.data.zones.find((z) => z.zone === "derivatives")?.count ?? 0
								]
							}) : null,
							q.data.paths?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: [
									q.data.paths.filter((p) => p.workflow.status === "running").length,
									" path",
									q.data.paths.filter((p) => p.workflow.status === "running").length === 1 ? "" : "s",
									" running"
								]
							}) : null,
							q.data.llm === "UNAVAILABLE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-review",
								children: "Occupations cannot think until the language model is available. Files still preserve."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "Photos, documents, and outputs stay on those records. Nothing here is marked WORKING."
							})
						]
					})
				]
			}) : null
		]
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
export { Home as component };
