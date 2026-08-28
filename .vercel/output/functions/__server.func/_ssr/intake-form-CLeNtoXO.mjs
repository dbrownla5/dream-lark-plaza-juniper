import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as getBearerToken } from "./client-CGEuTn_7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intake-form-CLeNtoXO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IntakeForm() {
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		const token = getBearerToken();
		if (!token) return;
		e.preventDefault();
		setBusy(true);
		setNotice(null);
		try {
			const form = e.currentTarget;
			const fd = new FormData(form);
			const res = await fetch("/api/intake", {
				method: "POST",
				body: fd,
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json"
				}
			});
			const json = await res.json();
			if (!res.ok) {
				setNotice(json.error || `Intake failed (${res.status})`);
				return;
			}
			setNotice("Kept. Your words are sealed. Files, if any, are preserved on the server.");
			form.reset();
			if (json.photos?.batchId) window.location.assign("/media");
		} catch (err) {
			setNotice(err instanceof Error ? err.message : "Intake failed");
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
				children: "Originals are written once, checksummed, and kept. Drag-and-drop is one intake path — the same pipeline accepts the API."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "files",
				name: "files",
				type: "file",
				multiple: true,
				className: "mt-3 block w-full text-sm text-fg file:mr-3 file:rounded-md file:border file:border-border file:bg-bg file:px-3 file:py-2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy,
					className: "min-h-11 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg disabled:opacity-60",
					children: busy ? "Preserving…" : "Bring in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Native form POST — does not depend on a scripted button."
				})]
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-review",
				children: notice
			}) : null
		]
	});
}
//#endregion
export { IntakeForm as t };
