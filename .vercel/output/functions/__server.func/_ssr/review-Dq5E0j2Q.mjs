import { a as require_jsx_runtime, i as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { d as loadReview, i as Status, m as postApproval, n as Panel, r as Shell, t as Empty, w as useAuthedQuery } from "./use-authed-query-BluSw2KL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/review-Dq5E0j2Q.js
var import_jsx_runtime = require_jsx_runtime();
function ReviewPage() {
	const qc = useQueryClient();
	const q = useAuthedQuery("review", () => loadReview());
	const decide = useMutation({
		mutationFn: (input) => postApproval({ data: input }),
		onSettled: () => qc.invalidateQueries({ queryKey: ["review"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Review",
		lede: "Pending decisions and their consequences. Nothing executes before approval when required.",
		children: q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Approvals",
					children: q.data.approvals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No approval records." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: q.data.approvals.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: String(a.consequence) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(a.status) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted",
									children: String(a.action_kind)
								}),
								a.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-md bg-primary px-3 py-2 text-primary-fg",
										onClick: () => decide.mutate({
											approvalId: String(a.id),
											status: "approved"
										}),
										children: "Approve"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-md border border-border px-3 py-2",
										onClick: () => decide.mutate({
											approvalId: String(a.id),
											status: "denied"
										}),
										children: "Deny"
									})]
								}) : null
							]
						}, String(a.id)))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Uncertain media",
					children: q.data.media.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No media in review." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.media.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							String(m.original_filename),
							" · ",
							String(m.quality_flag),
							" · ",
							String(m.analysis_model)
						] }, String(m.id)))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Uncertain documents",
					children: q.data.docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No documents in review." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							String(d.original_filename),
							" · ",
							String(d.classification)
						] }, String(d.id)))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Blocked work",
					children: q.data.blocked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No blocked tasks." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.blocked.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							String(t.title),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: String(t.status) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-review",
								children: String(t.uncertainty ?? "")
							})
						] }, String(t.id)))
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading review…"
		})
	});
}
//#endregion
export { ReviewPage as component };
