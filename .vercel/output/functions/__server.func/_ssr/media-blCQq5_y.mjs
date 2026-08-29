import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as Status, l as loadMedia, n as Panel, r as Shell, t as Empty, w as useAuthedQuery } from "./use-authed-query-BluSw2KL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media-blCQq5_y.js
var import_jsx_runtime = require_jsx_runtime();
function MediaPage() {
	const q = useAuthedQuery("media", () => loadMedia());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Media",
		lede: "Batches, originals, managed names, derivatives, item links, review states. Originals are write-once.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Containers",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2 sm:grid-cols-3 text-sm",
						children: (q.data.zones ?? []).map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: z.zone
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 font-mono text-xs text-muted",
								children: z.count
							})]
						}, z.zone))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Batches",
					children: q.data.batches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No batches. Use Intake — the same pipeline accepts the API." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.batches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								String(b.id),
								" · ",
								String(b.source_type),
								" · ",
								String(b.item_count),
								" files"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(b.status) })]
						}, String(b.id)))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Assets",
					children: q.data.assets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No catalogued assets." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: q.data.assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: String(a.original_filename)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted",
									children: ["managed: ", String(a.managed_filename)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-xs text-subtle",
									children: String(a.checksum_sha256)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 flex flex-wrap gap-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(a.review_state) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["quality ", String(a.quality_flag)] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["model ", String(a.analysis_model)] }),
										a.duplicate_group ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["dup ", String(a.duplicate_group)] }) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-2 inline-block text-primary",
									href: `/api/blob/${a.blob_id}`,
									children: "Original"
								})
							]
						}, String(a.id)))
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading catalog…"
		})
	});
}
//#endregion
export { MediaPage as component };
