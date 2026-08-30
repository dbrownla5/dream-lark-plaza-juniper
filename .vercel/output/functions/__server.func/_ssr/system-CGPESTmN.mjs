import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { _ as postQualify, b as postSelfTest, f as loadSystem, g as postMcpToken, n as Panel, r as Shell, t as Empty, w as useAuthedQuery } from "./use-authed-query-BluSw2KL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/system-CGPESTmN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SystemPage() {
	const qc = useQueryClient();
	const q = useAuthedQuery("system", () => loadSystem());
	const [token, setToken] = (0, import_react.useState)(null);
	const [prove, setProve] = (0, import_react.useState)(null);
	const [proveErr, setProveErr] = (0, import_react.useState)(null);
	const [proving, setProving] = (0, import_react.useState)(false);
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
					title: "Storage containers",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Live zones on this server. Originals are write-once after checksum. Empty is still a container."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2 sm:grid-cols-3",
						children: (q.data.zones ?? []).map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-border px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: z.zone
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-muted",
								children: [
									z.count,
									" objects · ",
									z.bytes,
									" B"
								]
							})]
						}, z.zone))
					})]
				}),
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
					title: "Run ledger",
					children: !q.data.runs || q.data.runs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No occupational runs recorded yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs text-muted",
						children: [
							q.data.runTotals.n,
							" runs · ",
							q.data.runTotals.cost.toFixed(2),
							" ¢ total"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"role ",
								String(r.role_id),
								" · ",
								r.model ? String(r.model) : "no provider call",
								r.blocked_reason ? ` · ${String(r.blocked_reason).slice(0, 60)}` : ""
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: r.prompt_tokens != null ? `${r.prompt_tokens}+${r.completion_tokens} tok` : "—"
							})]
						}, String(r.id)))
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Server queue",
					children: !q.data.jobs || q.data.jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No intake jobs yet. Bring in a file and the server queues the occupations." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: q.data.jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								j.kind,
								" · ",
								j.id.slice(0, 18)
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: j.status
							})]
						}, j.id))
					})
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
									onClick: async () => {
										setProving(true);
										setProveErr(null);
										try {
											const res = await fetch("/api/prove", { headers: { Accept: "application/json" } });
											const json = await res.json();
											setProve(json);
											if (!res.ok) setProveErr("Prove path failed.");
										} catch (e) {
											setProveErr(e instanceof Error ? e.message : "Prove path failed.");
										} finally {
											setProving(false);
											qc.invalidateQueries({ queryKey: ["system"] });
										}
									},
									disabled: proving,
									children: proving ? "Proving…" : "Prove storage and one occupation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-md border border-border px-4 py-2 text-sm",
									onClick: async () => {
										setProving(true);
										setProveErr(null);
										try {
											const json = await (await fetch("/api/verify", { headers: { Accept: "application/json" } })).json();
											setProve(json);
											if (!json.ok) setProveErr(json.launch || "Verify failed.");
										} catch (e) {
											setProveErr(e instanceof Error ? e.message : "Verify failed.");
										} finally {
											setProving(false);
											qc.invalidateQueries({ queryKey: ["system"] });
										}
									},
									disabled: proving,
									children: proving ? "Verifying desk…" : "Verify every path"
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
						prove ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-1 text-sm",
							children: [prove.checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
									prove.passed,
									" passed · ",
									prove.failed,
									" failed"
								]
							})]
						}) : null,
						prove?.interpretation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-3 overflow-x-auto whitespace-pre-wrap text-xs",
							children: prove.interpretation
						}) : null,
						proveErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-danger",
							children: proveErr
						}) : null,
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
