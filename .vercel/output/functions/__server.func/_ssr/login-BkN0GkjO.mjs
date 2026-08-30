import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import "./client-COXjRbXB.mjs";
import "./verify.server-CxW1uwmY.mjs";
import { n as useCurrentUserState } from "./use-current-user-DNFZyesX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BkN0GkjO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user } = useCurrentUserState();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
}
//#endregion
export { Login as component };
