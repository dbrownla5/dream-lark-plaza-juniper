import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as getSql, t as dbSource } from "./db-C8HHyr9m.mjs";
import { r as auth, t as getSessionUser } from "./verify.server-BERuMYjt.mjs";
import { N as runOccupation, O as llmAvailable, R as writeContext, _ as getObjectBytes, a as authenticateMcp, b as ingestDocument, g as getObject, h as ensureWorkspace, k as mcpUnauthorized, n as ROLES, o as classifyIntakeDomain, t as LLM_MODEL, u as createTask, x as ingestPhotoBatch, y as handleJsonRpc } from "./mcp-BrNtE2b3.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BFD3Z3wa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function QueryProvider({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 5e3,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children
	});
}
var styles_default = "/assets/styles-3BHFYMUP.css";
var APP_NAME = "Well Lived Citizen";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$16 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#2c4a3e"
			},
			{
				name: "description",
				content: "Occupational operating system — intake, work, catalog, living context."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$10 = () => import("./routes-BbBAthca.mjs");
var Route$15 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./agents-CJYQ3odB.mjs");
var Route$14 = createFileRoute("/agents")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./context-BeEfrApa.mjs");
var Route$13 = createFileRoute("/context")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./documents-BUMgxJiP.mjs");
var Route$12 = createFileRoute("/documents")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./intake-Bs8StM77.mjs");
var Route$11 = createFileRoute("/intake")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./login-DWJRtx0c.mjs");
var Route$10 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./media-D7aUo63g.mjs");
var Route$9 = createFileRoute("/media")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./outputs-B_DdAESd.mjs");
var Route$8 = createFileRoute("/outputs")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./review-Du9vUBgY.mjs");
var Route$7 = createFileRoute("/review")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./system-BqqFQNvX.mjs");
var Route$6 = createFileRoute("/system")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./work-DenoNy1R.mjs");
var Route$5 = createFileRoute("/work")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var DEPLOY_ADAPTERS = [{
	id: "vercel",
	label: "Vercel HTTPS web application",
	localhostProduction: false,
	cloudflare: false
}, {
	id: "node-host",
	label: "Generic Node HTTPS host (Nitro node-server)",
	localhostProduction: false,
	cloudflare: false
}];
var Route$4 = createFileRoute("/api/health")({ server: { handlers: { GET: async () => {
	const body = {
		ok: true,
		status: "PARTIAL",
		db: dbSource,
		llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
		roles: ROLES.length,
		adapters: DEPLOY_ADAPTERS.map((a) => a.id),
		time: (/* @__PURE__ */ new Date()).toISOString()
	};
	return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
} } } });
async function userIdFromRequest(request) {
	const authz = request.headers.get("authorization") ?? "";
	const bearer = authz.toLowerCase().startsWith("bearer ") ? authz.slice(7).trim() : null;
	const session = await getSessionUser(bearer ?? void 0);
	if (session?.id) return session.id;
	if (bearer) {
		const sql = await getSql();
		return authenticateMcp(sql, { token: bearer });
	}
	const err = /* @__PURE__ */ new Error("Unauthorized");
	err.status = 401;
	throw err;
}
var Route$3 = createFileRoute("/api/intake")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const userId = await userIdFromRequest(request);
		const sql = await getSql();
		await ensureWorkspace(sql, userId);
		const form = await request.formData();
		const words = String(form.get("words") ?? "").trim();
		const sourceType = String(form.get("source_type") ?? "web_app");
		const isTestOnly = String(form.get("is_test_only") ?? "") === "1";
		const files = form.getAll("files").filter((f) => f instanceof File && f.size > 0);
		const photos = [];
		const docs = [];
		for (const file of files) {
			const bytes = new Uint8Array(await file.arrayBuffer());
			const mime = file.type || "application/octet-stream";
			if (mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic)$/i.test(file.name)) photos.push({
				filename: file.name,
				mime,
				bytes
			});
			else docs.push({
				filename: file.name,
				mime,
				bytes
			});
		}
		const result = {
			ok: true,
			userId
		};
		if (words) {
			const rec = await writeContext(sql, {
				userId,
				kind: "processing_aloud",
				body: words,
				author: "user",
				source: `intake:${sourceType}`
			});
			await writeContext(sql, {
				userId,
				kind: "user_statement",
				body: words,
				author: "user",
				source: `intake:${sourceType}`,
				lineageId: rec.lineage_id
			});
			if (String(form.get("place_on_desk") ?? "") === "1") {
				const domain = classifyIntakeDomain(words);
				const task = await createTask(sql, {
					userId,
					roleId: domain.roleId,
					title: "Desk work",
					requestStatement: words,
					isTestOnly
				});
				const run = await runOccupation(sql, {
					userId,
					taskId: task.id,
					action: "ANALYZE"
				});
				result.words = {
					contextId: rec.id,
					listened: false,
					taskId: run.task.id,
					status: run.task.status,
					blockedReason: run.blockedReason,
					domain
				};
			} else result.words = {
				contextId: rec.id,
				listened: true
			};
		}
		if (photos.length) result.photos = await ingestPhotoBatch(sql, {
			userId,
			files: photos,
			sourceType,
			isTestOnly
		});
		if (docs.length) {
			result.documents = [];
			for (const d of docs) result.documents.push(await ingestDocument(sql, {
				userId,
				filename: d.filename,
				mime: d.mime,
				bytes: d.bytes,
				isTestOnly
			}));
		}
		const accept = request.headers.get("accept") ?? "";
		if (accept.includes("text/html") && !accept.includes("application/json")) {
			const loc = photos.length ? "/media" : docs.length ? "/documents" : "/intake";
			return new Response(null, {
				status: 303,
				headers: { Location: loc }
			});
		}
		return new Response(JSON.stringify(result), { headers: { "content-type": "application/json" } });
	} catch (err) {
		const status = err.status === 401 ? 401 : 500;
		const message = err instanceof Error ? err.message : "intake failed";
		return new Response(JSON.stringify({
			ok: false,
			error: message
		}), {
			status,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
var Route$2 = createFileRoute("/api/mcp")({ server: { handlers: {
	POST: async ({ request }) => {
		try {
			const body = await request.json();
			const authz = request.headers.get("authorization") ?? "";
			const bearer = authz.toLowerCase().startsWith("bearer ") ? authz.slice(7).trim() : null;
			const session = await getSessionUser(bearer ?? void 0);
			const sql = await getSql();
			const userId = await authenticateMcp(sql, {
				userIdFromSession: session?.id ?? null,
				token: bearer
			});
			await ensureWorkspace(sql, userId);
			const res = await handleJsonRpc(sql, userId, body);
			return new Response(JSON.stringify(res), { headers: { "content-type": "application/json" } });
		} catch (err) {
			const status = err.status === 401 ? 401 : 500;
			if (status === 401) return new Response(JSON.stringify(mcpUnauthorized()), {
				status: 401,
				headers: { "content-type": "application/json" }
			});
			const message = err instanceof Error ? err.message : "mcp failed";
			return new Response(JSON.stringify({
				jsonrpc: "2.0",
				id: null,
				error: {
					code: -32603,
					message
				}
			}), {
				status,
				headers: { "content-type": "application/json" }
			});
		}
	},
	GET: async () => {
		return new Response(JSON.stringify({
			name: "dayna-os-mcp",
			transport: "jsonrpc-http",
			path: "/api/mcp",
			status: "PARTIAL"
		}), { headers: { "content-type": "application/json" } });
	}
} } });
var Route$1 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route = createFileRoute("/api/blob/$id")({ server: { handlers: { GET: async ({ request, params }) => {
	try {
		const userId = await userIdFromRequest(request);
		const sql = await getSql();
		const meta = await getObject(sql, userId, params.id);
		if (!meta) return new Response("not found", { status: 404 });
		const bytes = await getObjectBytes(sql, userId, params.id);
		return new Response(Buffer.from(bytes), { headers: {
			"content-type": meta.mime || "application/octet-stream",
			"content-disposition": `inline; filename="${meta.original_filename ?? meta.id}"`,
			"x-checksum-sha256": meta.checksum_sha256,
			"cache-control": "private, max-age=0, must-revalidate"
		} });
	} catch (err) {
		const status = err.status === 401 ? 401 : 500;
		return new Response(err instanceof Error ? err.message : "error", { status });
	}
} } } });
var rootRouteChildren = {
	IndexRoute: Route$15.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$16
	}),
	AgentsRoute: Route$14.update({
		id: "/agents",
		path: "/agents",
		getParentRoute: () => Route$16
	}),
	ContextRoute: Route$13.update({
		id: "/context",
		path: "/context",
		getParentRoute: () => Route$16
	}),
	DocumentsRoute: Route$12.update({
		id: "/documents",
		path: "/documents",
		getParentRoute: () => Route$16
	}),
	IntakeRoute: Route$11.update({
		id: "/intake",
		path: "/intake",
		getParentRoute: () => Route$16
	}),
	LoginRoute: Route$10.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$16
	}),
	MediaRoute: Route$9.update({
		id: "/media",
		path: "/media",
		getParentRoute: () => Route$16
	}),
	OutputsRoute: Route$8.update({
		id: "/outputs",
		path: "/outputs",
		getParentRoute: () => Route$16
	}),
	ReviewRoute: Route$7.update({
		id: "/review",
		path: "/review",
		getParentRoute: () => Route$16
	}),
	SystemRoute: Route$6.update({
		id: "/system",
		path: "/system",
		getParentRoute: () => Route$16
	}),
	WorkRoute: Route$5.update({
		id: "/work",
		path: "/work",
		getParentRoute: () => Route$16
	}),
	ApiHealthRoute: Route$4.update({
		id: "/api/health",
		path: "/api/health",
		getParentRoute: () => Route$16
	}),
	ApiIntakeRoute: Route$3.update({
		id: "/api/intake",
		path: "/api/intake",
		getParentRoute: () => Route$16
	}),
	ApiMcpRoute: Route$2.update({
		id: "/api/mcp",
		path: "/api/mcp",
		getParentRoute: () => Route$16
	}),
	ApiAuthSplatRoute: Route$1.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$16
	}),
	ApiBlobIdRoute: Route.update({
		id: "/api/blob/$id",
		path: "/api/blob/$id",
		getParentRoute: () => Route$16
	})
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { createSsrRpc as n, router_exports as t };
