import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as getRole } from "./mcp-BrNtE2b3.mjs";
import { o as loadOutputs, y as useAuthedQuery } from "./use-authed-query-CFLYtheB.mjs";
import { i as Status, n as Panel, r as Shell, t as Empty } from "./shell-gISFBP99.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/outputs-B_DdAESd.js
var import_jsx_runtime = require_jsx_runtime();
function OutputsPage() {
	const q = useAuthedQuery("outputs", () => loadOutputs());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Outputs",
		lede: "Completed work, versions, evidence references, restart and reuse paths.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Deliverables",
				children: q.data.outputs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No completed occupational outputs yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: q.data.outputs.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-border p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: String(o.title)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(o.status) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: safeRole(Number(o.role_id))
							}),
							o.output_json ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-2 overflow-x-auto text-xs text-subtle",
								children: String(o.output_json)
							}) : null
						]
					}, String(o.id)))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Artifact lineages",
				children: q.data.artifacts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No versioned artifacts." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: q.data.artifacts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						String(a.title),
						" · ",
						String(a.kind),
						" · v",
						String(a.current_version)
					] }, String(a.id)))
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading outputs…"
		})
	});
}
function safeRole(id) {
	try {
		return getRole(id).name;
	} catch {
		return `role ${id}`;
	}
}
//#endregion
export { OutputsPage as component };
