import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as GROK_PROVIDERS } from "./verify.server-BERuMYjt.mjs";
import { i as signIn } from "./client-CGEuTn_7.mjs";
import { n as useCurrentUserState } from "./use-current-user-C1gy_R6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DWJRtx0c.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-border bg-surface p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] text-muted",
					children: "Well Lived Citizen"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-tight text-fg",
					children: "Your operating system"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "One sign-in. Google or X. Not a passcode. This is so your words, files, and work stay yours — not so you have to fight a wall."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: isPending,
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						className: "w-full rounded-md border border-border bg-bg px-4 py-3 text-sm font-medium text-fg hover:border-primary hover:text-primary disabled:opacity-60",
						children: ["Continue with ", p.label]
					}, p.providerId))
				})
			]
		})
	});
}
//#endregion
export { Login as component };
