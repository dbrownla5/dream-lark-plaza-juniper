import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { C as submitCorrection, S as sealVoicePillar, n as Panel, o as loadContext, r as Shell, t as Empty, w as useAuthedQuery } from "./use-authed-query-BluSw2KL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/context-BeRgNYI1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContextPage() {
	const qc = useQueryClient();
	const q = useAuthedQuery("context", () => loadContext());
	const [target, setTarget] = (0, import_react.useState)(null);
	const [body, setBody] = (0, import_react.useState)("");
	const [slots, setSlots] = (0, import_react.useState)([
		"",
		"",
		""
	]);
	const corr = useMutation({
		mutationFn: () => submitCorrection({ data: {
			supersedesId: target,
			body
		} }),
		onSuccess: () => {
			setTarget(null);
			setBody("");
			qc.invalidateQueries({ queryKey: ["context"] });
		}
	});
	const voice = useMutation({
		mutationFn: (slot) => sealVoicePillar({ data: {
			slot,
			body: slots[slot - 1]
		} }),
		onSuccess: (_d, slot) => {
			setSlots((prev) => {
				const next = [...prev];
				next[slot - 1] = "";
				return next;
			});
			qc.invalidateQueries({ queryKey: ["context"] });
		}
	});
	const pillars = q.data?.pillars ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		title: "Memory",
		lede: "Your words, evidence, inference, and corrections stay distinguishable. Voice pillars are occupation 15's sources — not last year's AI.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: `Voice pillars ${pillars.length}/3`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "Three pieces you actually wrote. Approving one is you saying: write from this. Incoming files stay evidence."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					1,
					2,
					3
				].map((slot) => {
					const saved = pillars.find((p) => p.scope === String(slot));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted",
								children: ["Letter ", slot]
							}),
							saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-6 whitespace-pre-wrap text-sm",
								children: saved.body
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "mt-2 w-full rounded-md border border-border bg-bg px-2 py-2 text-sm",
								rows: 6,
								value: slots[slot - 1],
								onChange: (e) => setSlots((prev) => {
									const next = [...prev];
									next[slot - 1] = e.target.value;
									return next;
								}),
								placeholder: "Paste a piece you wrote."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 min-h-11 w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-fg",
								disabled: !slots[slot - 1].trim() || voice.isPending,
								onClick: () => voice.mutate(slot),
								children: "This is mine"
							})] }),
							voice.error && voice.variables === slot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-danger",
								children: voice.error.message
							}) : null
						]
					}, slot);
				})
			})]
		}), q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Records",
				children: [q.data.records.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No living context yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: q.data.records.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-border p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase tracking-wide text-muted",
									children: r.kind
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-subtle",
									children: [
										r.author,
										" · v",
										r.version_n,
										r.superseded_by ? " · superseded" : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap",
								children: r.body
							}),
							r.kind !== "correction" && !r.superseded_by ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 text-sm text-primary",
								onClick: () => setTarget(r.id),
								children: "Correct this"
							}) : null
						]
					}, r.id))
				}), target ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-2",
					onSubmit: (e) => {
						e.preventDefault();
						corr.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm",
							htmlFor: "correction",
							children: "Correction (does not erase history)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "correction",
							className: "w-full rounded-md border border-border bg-bg px-3 py-2",
							rows: 4,
							value: body,
							onChange: (e) => setBody(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "min-h-11 rounded-md bg-primary px-4 py-2 text-primary-fg",
							children: "Record correction"
						})
					]
				}) : null]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading memory…"
		})]
	});
}
//#endregion
export { ContextPage as component };
