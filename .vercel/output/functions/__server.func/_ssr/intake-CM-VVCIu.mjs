import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Status, l as loadMedia, n as Panel, r as Shell, s as loadDocuments, t as Empty, w as useAuthedQuery } from "./use-authed-query-BluSw2KL.mjs";
import { t as IntakeForm } from "./intake-form-D4qJngMD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intake-CM-VVCIu.js
var import_jsx_runtime = require_jsx_runtime();
function IntakePage() {
	const docs = useAuthedQuery("documents", () => loadDocuments());
	const media = useAuthedQuery("media", () => loadMedia());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		title: "Bring in",
		lede: "Words are sealed. Files are checksummed into originals. The same event starts the occupational path.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntakeForm, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Documents in the catalog",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/documents",
					className: "text-sm text-primary",
					children: "All"
				}),
				children: !docs.data || docs.data.documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No documents held yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: docs.data.documents.slice(0, 8).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						String(d.original_filename),
						" · ",
						String(d.classification),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(d.review_state) })
					] }, String(d.id)))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Photo batches",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/media",
					className: "text-sm text-primary",
					children: "Catalog"
				}),
				children: !media.data || media.data.batches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No photo batches held yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: media.data.batches.slice(0, 8).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						String(b.item_count),
						" files · ",
						String(b.source_type),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(b.status) })
					] }, String(b.id)))
				})
			})]
		})]
	});
}
//#endregion
export { IntakePage as component };
