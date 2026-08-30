import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as useRouterState, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import "./client-COXjRbXB.mjs";
import { t as authMiddleware } from "./middleware-BZDI_wCj.mjs";
import { n as createSsrRpc } from "./router-BTkk18-i.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-DNFZyesX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-authed-query-BluSw2KL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var loadHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("61c3a9cf505ce555f011a9cd99afbb4af90e267a1e8cec70f021b4735bc4e5a7"));
var loadAgents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b21cd5edb8910bdfe12b817bef301c381d23e67f1ae09bd26a96bb531a007c31"));
var loadWork = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("49dbb9cc84a771efe63a804262f28f0469037b5be608d2f6202845781efd93b1"));
var loadMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a0e3bcf60955ab12a4fea42f06c8f2bca64a6f226b0f8363b016d4371001640b"));
var loadDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("839a34b74e283c8b886bea7b8bf9fa49b60030bdaf4c78ef936721d23b2cb91a"));
var loadReview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1ead7bebe510b535aac00ff4b3b9533bc0cfbe5a21b8b0c7f34e89888c9a76cb"));
var loadContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8f908008f69067becaa467cf1cda9b45b8ac424976d53bc3f7550ac61474c633"));
var loadOutputs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ba43822caf69b3d104990edbffec74bb34b1791094fc04be50b77168013fccba"));
var loadSystem = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1c48f574f87ad3548a64672122efa9570b10da1617e5fb73a3540da9b16c66ff"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("16507f8bc426157025e34b8f8ad6fdf77c134329ac997343a75f22d46bca30e8"));
var submitCorrection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d777d437ff4236b21d4b8a1cd8d18ccb1a2811222dd2e0b943f967eaed2e65ca"));
var sealVoicePillar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e7c83328a975ca6e581baf536aee68ab2179c77a1180acae9516ed261d146f30"));
var postApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("46bf51134ce78b33668719ee7dcf437d3f5ed4ba13c524de8523e1da6319b823"));
var postResume = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("963a868fc0e00f5e51b64a4ead60c1d48439fd948e3cdc97cda63eeb3ec546ef"));
var postStartChain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8a37e85ec985d189858e2d8e9ce54a200fedaca4eae363102ae222a560e4455c"));
var postDriveWorkflow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3ec87ce1568187855b0f6d78b34205b7b9cdf6596c1fac4440ad658baf64deef"));
var postSelfTest = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9dbd7b3d567614fe256f408032ea34664545414bd3e1adcb2f4dee475943f68c"));
var postQualify = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9d570e9ad256269e593fabca6ee6775bd87698190af132fffd9c008a8af64a14"));
var postMcpToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5d229e8c07a0d04251625a870c90e170625dc6f4cafa1592f4632a6200ef8f61"));
var postRunRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("15a572260f3181072141430b95a290dbd8bcaa447a35f973c08e61fda94d25f9"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bae63bd1258a5008e9aa479cb1eb8266bca7bed682b7aea91c80f5d20e0ffe26"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("68b4864f0c3545d6898a5fdc318d88187819f8d15b153bdbe5f9dd3af966555d"));
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			false
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Today"
	},
	{
		to: "/intake",
		label: "Bring in"
	},
	{
		to: "/media",
		label: "Catalog"
	},
	{
		to: "/agents",
		label: "Occupations"
	},
	{
		to: "/work",
		label: "Work"
	},
	{
		to: "/context",
		label: "Memory"
	},
	{
		to: "/system",
		label: "System"
	}
];
function Shell({ children, title, lede }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [gaveUp, setGaveUp] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isPending) {
			setGaveUp(false);
			return;
		}
		const t = window.setTimeout(() => setGaveUp(true), 4e3);
		return () => window.clearTimeout(t);
	}, [isPending]);
	if (isPending && !gaveUp) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg",
					children: "Well Lived Citizen"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Opening your system…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-40 animate-pulse rounded-xl bg-border/70" })
			]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg tracking-tight text-fg",
							children: "Well Lived Citizen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Occupational OS · not marked WORKING"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden max-w-[12rem] truncate text-sm text-muted sm:inline",
							children: user.displayName ?? user.primaryEmail
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Primary",
					className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: "shrink-0 rounded-md px-3 py-2 text-sm no-underline transition-colors duration-150 " + (active ? "bg-primary text-primary-fg" : "text-muted hover:bg-border/60 hover:text-fg"),
							children: item.label
						}, item.to);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				className: "mx-auto max-w-6xl px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-6 max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight text-fg",
						children: title
					}), lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: lede
					}) : null]
				}), children]
			})
		]
	});
}
function Panel({ title, children, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg text-fg",
				children: title
			}), action]
		}), children]
	});
}
function Status({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `font-mono text-xs uppercase tracking-wide ${value === "done" ? "text-ok" : value === "blocked" || value === "failed" ? "text-danger" : value === "waiting_approval" || value === "review" ? "text-review" : "text-muted"}`,
		children: value
	});
}
function Empty({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children
	});
}
function useAuthedQuery(key, fn) {
	const { user, isPending } = useCurrentUserState();
	return useQuery({
		queryKey: [key],
		queryFn: fn,
		enabled: Boolean(user) && !isPending
	});
}
//#endregion
export { submitCorrection as C, sealVoicePillar as S, postQualify as _, loadAgents as a, postSelfTest as b, loadHome as c, loadReview as d, loadSystem as f, postMcpToken as g, postDriveWorkflow as h, Status as i, loadMedia as l, postApproval as m, Panel as n, loadContext as o, loadWork as p, Shell as r, loadDocuments as s, Empty as t, loadOutputs as u, postResume as v, useAuthedQuery as w, postStartChain as x, postRunRole as y };
