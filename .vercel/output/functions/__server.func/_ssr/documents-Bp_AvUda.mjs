import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { T as getRole } from "./mcp-DLqpv-_h.mjs";
import { i as Status, n as Panel, r as Shell, s as loadDocuments, t as Empty, w as useAuthedQuery } from "./use-authed-query-BluSw2KL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-Bp_AvUda.js
var import_jsx_runtime = require_jsx_runtime();
function DocumentsPage() {
	const q = useAuthedQuery("documents", () => loadDocuments());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Documents",
		lede: "Originals, extracted text, classification, relationships, evidence. Filenames are not truth.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Catalog",
			children: q.data.documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No documents yet. Upload from Intake." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: q.data.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md border border-border p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: String(d.original_filename)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: ["managed: ", String(d.managed_filename)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1",
							children: [
								String(d.classification),
								" ",
								d.routed_role ? `→ ${safeRole(Number(d.routed_role))}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-xs text-subtle",
							children: String(d.checksum_sha256)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(d.review_state) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "ml-3 text-primary",
							href: `/api/blob/${d.blob_id}`,
							children: "Original"
						})
					]
				}, String(d.id)))
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading documents…"
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
export { DocumentsPage as component };
