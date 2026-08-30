import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as getBearerToken } from "./client-COXjRbXB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intake-form-D4qJngMD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IntakeForm() {
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [output, setOutput] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setNotice(null);
		setOutput(null);
		try {
			const form = e.currentTarget;
			const fd = new FormData(form);
			const headers = { Accept: "application/json" };
			const token = getBearerToken();
			if (token) headers.Authorization = `Bearer ${token}`;
			const res = await fetch("/api/intake", {
				method: "POST",
				body: fd,
				headers
			});
			const json = await res.json();
			if (!res.ok || json.ok === false) {
				setNotice(json.error || `Bring-in failed (${res.status})`);
				return;
			}
			const bits = [];
			if (json.words?.listened) bits.push("Your words are sealed. No occupation was started.");
			if (json.words?.taskId) {
				bits.push(`Occupation ${json.words.status ?? "ran"}.`);
				if (json.words.blockedReason) bits.push(json.words.blockedReason);
				if (json.words.interpretation) setOutput(json.words.interpretation);
				else if (json.words.output) setOutput(json.words.output);
			}
			if (json.photos?.batchId) bits.push(`Photos preserved${json.photos.originalsPreserved ? ", originals write-once" : ""}.`);
			if (json.documents?.length) {
				json.documents[0];
				bits.push(`${json.documents.length} document(s) preserved on the server. Occupations queued.`);
			}
			setNotice(bits.join(" ") || "Kept.");
			form.reset();
		} catch (err) {
			setNotice(err instanceof Error ? err.message : "Bring-in failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		method: "POST",
		action: "/api/intake",
		encType: "multipart/form-data",
		onSubmit,
		className: "rounded-xl border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name: "source_type",
				value: "web_app"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-medium text-fg",
				htmlFor: "words",
				children: "What are you working through"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Speak as you think. This is kept as your words. It does not start a job. To have an occupation work it, open Occupations and put it on that desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "words",
				name: "words",
				rows: 7,
				className: "mt-3 w-full rounded-md border border-border bg-bg px-3 py-3 text-base text-fg",
				placeholder: "Unfinished thought, correction, or the work you want done…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-5 block text-sm font-medium text-fg",
				htmlFor: "files",
				children: "Files and photos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Originals are written once, checksummed, and kept."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "files",
				name: "files",
				type: "file",
				multiple: true,
				className: "mt-3 block w-full text-sm text-fg file:mr-3 file:rounded-md file:border file:border-border file:bg-bg file:px-3 file:py-2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy,
					className: "min-h-11 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg disabled:opacity-60",
					children: busy ? "Preserving…" : "Bring in"
				})
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ok",
				children: notice
			}) : null,
			output ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-bg p-3 text-sm",
				children: output
			}) : null
		]
	});
}
//#endregion
export { IntakeForm as t };
