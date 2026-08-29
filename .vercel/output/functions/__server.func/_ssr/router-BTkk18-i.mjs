import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, c as __exportAll, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as getSql, t as dbSource } from "./db-Dw_TDOBo.mjs";
import { i as auth, n as getSessionUser, t as DEV_USER_ID } from "./verify.server-CxW1uwmY.mjs";
import { a as pgliteDir, i as ensureDataDirs, r as diskStorageEnabled, t as dataDir } from "./data-dir-D6IkF-jd.mjs";
import { $ as zoneCensus, B as makeSolidPng, C as getObject, D as ingestDocument, E as handleJsonRpc, K as runOccupation, L as listTasks, O as ingestOriginal, Q as writeContext, S as ensureWorkspace, U as qualifyMechanicalSkills, V as mcpUnauthorized, W as refineArtifact, X as startQueueWorker, Y as startChain, Z as tryMutateOriginal, _ as detectCircularHandoff, a as WORKFLOW_CHAINS, c as authenticateMcp, d as correctContext, f as createArtifact, i as TEST_ONLY_WORDS, k as ingestPhotoBatch, l as classifyIntakeDomain, m as currentOfLineage, n as ROLES, o as assertActionAllowed, p as createTask, q as sha256Hex, r as TEST_ONLY_DOCUMENT, s as assertProhibitedSpeech, t as LLM_MODEL, u as containsSecret, v as drainIntakeQueue, w as getObjectBytes, y as driveUntilBlocked, z as llmAvailable } from "./mcp-DLqpv-_h.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BTkk18-i.js
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
var styles_default = "/assets/styles-Do9_ZjN9.css";
var APP_NAME = "Well Lived Citizen";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$18 = createRootRoute({
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
var $$splitComponentImporter$10 = () => import("./routes-BobVDiNR.mjs");
var Route$17 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./agents-Dp_ocGX8.mjs");
var Route$16 = createFileRoute("/agents")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./context-BeRgNYI1.mjs");
var Route$15 = createFileRoute("/context")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./documents-Bp_AvUda.mjs");
var Route$14 = createFileRoute("/documents")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./intake-CM-VVCIu.mjs");
var Route$13 = createFileRoute("/intake")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./login-BkN0GkjO.mjs");
var Route$12 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./media-blCQq5_y.mjs");
var Route$11 = createFileRoute("/media")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./outputs-RDumeSOy.mjs");
var Route$10 = createFileRoute("/outputs")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./review-Dq5E0j2Q.mjs");
var Route$9 = createFileRoute("/review")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./system-CGPESTmN.mjs");
var Route$8 = createFileRoute("/system")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./work-D3Xqz_qo.mjs");
var Route$7 = createFileRoute("/work")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
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
var started = false;
function ensureServerRuntime() {
	if (started) return;
	started = true;
	ensureDataDirs();
	startQueueWorker(getSql);
}
function serverFacts() {
	ensureDataDirs();
	return {
		dataDir: dataDir(),
		pgliteDir: pgliteDir(),
		diskStorage: diskStorageEnabled(),
		db: process.env.DATABASE_URL?.trim() ? "neon" : "pglite-file"
	};
}
var Route$6 = createFileRoute("/api/health")({ server: { handlers: { GET: async () => {
	ensureServerRuntime();
	const facts = serverFacts();
	const body = {
		ok: true,
		status: "PARTIAL",
		db: facts.db,
		diskStorage: facts.diskStorage,
		dataDir: facts.dataDir,
		llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
		roles: ROLES.length,
		adapters: DEPLOY_ADAPTERS.map((a) => a.id),
		time: (/* @__PURE__ */ new Date()).toISOString(),
		dbSource
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
	return DEV_USER_ID;
}
var Route$5 = createFileRoute("/api/intake")({ server: { handlers: { POST: async ({ request }) => {
	try {
		ensureServerRuntime();
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
					interpretation: run.task.interpretation,
					output: run.task.output_json,
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
var Route$4 = createFileRoute("/api/mcp")({ server: { handlers: {
	POST: async ({ request }) => {
		try {
			const body = await request.json();
			const authz = request.headers.get("authorization") ?? "";
			const bearer = authz.toLowerCase().startsWith("bearer ") ? authz.slice(7).trim() : null;
			const session = await getSessionUser(bearer ?? void 0);
			const sql = await getSql();
			const userId = await authenticateMcp(sql, {
				userIdFromSession: session?.id ?? "dev-user",
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
var Route$3 = createFileRoute("/api/prove")({ server: { handlers: { GET: async ({ request }) => {
	const checks = [];
	const add = (id, pass, detail) => checks.push({
		id,
		pass,
		detail
	});
	try {
		const userId = await userIdFromRequest(request);
		const sql = await getSql();
		await ensureWorkspace(sql, userId);
		add("roles", ROLES.length === 40, `${ROLES.length} occupations loaded`);
		add("llm", llmAvailable(), llmAvailable() ? LLM_MODEL : "UNAVAILABLE");
		const png = makeSolidPng(40, 90, 50, 16, 16);
		const stored = await ingestOriginal(sql, {
			userId,
			bytes: png,
			mime: "image/png",
			originalFilename: "TEST_ONLY_prove.png"
		});
		const back = await getObjectBytes(sql, userId, stored.original.id);
		add("intake_zone", stored.intake.zone === "intake", stored.intake.object_key);
		add("original_zone", stored.original.zone === "originals" && stored.original.immutable === 1, stored.original.object_key);
		add("checksum", sha256Hex(back) === stored.original.checksum_sha256, stored.original.checksum_sha256);
		let immutable = false;
		try {
			await tryMutateOriginal(sql, userId, stored.original.id, makeSolidPng(1, 1, 1, 8, 8));
		} catch (e) {
			immutable = e instanceof Error && e.message === "ORIGINAL_IMMUTABLE";
		}
		add("write_once", immutable, "original overwrite blocked");
		const doc = await ingestDocument(sql, {
			userId,
			filename: "TEST_ONLY_quokka.txt",
			mime: "text/plain",
			bytes: new Uint8Array(Buffer.from(TEST_ONLY_DOCUMENT)),
			isTestOnly: true
		});
		add("document", Boolean(doc.id) && Boolean(doc.extracted_text?.includes("SENTINEL")), doc.id);
		await drainIntakeQueue(sql, {
			userId,
			limit: 4
		});
		const wf = await sql.query(`select id, current_step, status, chain_id from workflow_instances where user_id = $1 and subject_id = $2 order by created_at desc limit 1`, [userId, doc.id]);
		add("workflow", Boolean(wf[0]), wf[0] ? `${wf[0].chain_id} ${wf[0].status} step ${wf[0].current_step}` : "missing");
		const tasks = wf[0] ? await sql.query(`select id, role_id, status, package_id, input_json, output_json, parent_task_id
               from tasks where user_id = $1 and workflow_id = $2 order by created_at`, [userId, wf[0].id]) : [];
		add("first_has_package", Boolean(tasks[0]?.package_id), tasks[0]?.package_id ?? "none");
		add("first_holds_text", Boolean(tasks[0]?.input_json && tasks[0].input_json.includes("SENTINEL")), tasks[0] ? `role ${tasks[0].role_id} ${tasks[0].status}` : "none");
		add("two_occupations", tasks.length >= 2, `${tasks.length} tasks`);
		add("second_got_prior", Boolean(tasks[1]?.input_json && (tasks[1].input_json.includes("fromTaskId") || tasks[1].input_json.includes("fromRoleId"))), tasks[1] ? `role ${tasks[1].role_id} ${tasks[1].status}` : "no second");
		add("connected_done", tasks.filter((t) => t.status === "done").length >= 1, tasks.map((t) => `${t.role_id}:${t.status}`).join(" → ") || "none");
		const pkg = tasks[0]?.package_id ? await sql.query(`select payload_json from work_packages where id = $1 and user_id = $2`, [tasks[0].package_id, userId]) : [];
		add("package_history", Boolean(pkg[0]?.payload_json && pkg[0].payload_json.includes("history") && pkg[0].payload_json.includes("taskId")), pkg[0]?.payload_json ? "history present" : "no history");
		const zones = await zoneCensus(sql, userId);
		add("outputs_zone", (zones.find((z) => z.zone === "outputs")?.count ?? 0) >= 1, String(zones.find((z) => z.zone === "outputs")?.count ?? 0));
		const failed = checks.filter((c) => !c.pass).length;
		return new Response(JSON.stringify({
			ok: failed === 0,
			passed: checks.length - failed,
			failed,
			checks,
			zones,
			path: tasks.map((t) => ({
				roleId: t.role_id,
				status: t.status,
				parent: t.parent_task_id
			})),
			output: tasks.find((t) => t.output_json)?.output_json ?? null
		}), { headers: { "content-type": "application/json" } });
	} catch (err) {
		add("crash", false, err instanceof Error ? err.message : "prove failed");
		return new Response(JSON.stringify({
			ok: false,
			passed: 0,
			failed: checks.length,
			checks
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
var MCP_TOOLS = [
	"tasks.list",
	"tasks.create",
	"context.read",
	"approvals.list",
	"media.list",
	"documents.list",
	"agents.directory",
	"workflows.status",
	"outputs.list",
	"health.status"
];
async function runDeskVerify(sql, userId) {
	const checks = [];
	const add = (id, pass, detail) => checks.push({
		id,
		pass,
		detail
	});
	await ensureWorkspace(sql, userId);
	add("roles", ROLES.length === 40, `${ROLES.length}`);
	add("chains_defined", WORKFLOW_CHAINS.length === 8, WORKFLOW_CHAINS.map((c) => c.id).join(","));
	add("llm", llmAvailable(), llmAvailable() ? LLM_MODEL : "UNAVAILABLE");
	const skills = await qualifyMechanicalSkills(sql, userId);
	add("skills", skills.qualified > 0, `qualified ${skills.qualified}`);
	add("guard_delete", !assertActionAllowed(1, "DELETE").ok, "intake cannot delete");
	add("guard_circle", !detectCircularHandoff([
		7,
		8,
		7
	], 8).ok, "circle blocked");
	add("guard_secret", containsSecret("XAI_API_KEY=abc") && containsSecret("GEMINI_API_KEY=abc"), "secrets detected");
	add("guard_sale", !assertProhibitedSpeech(32, "this is guaranteed to sell").ok, "listing cannot promise a sale");
	const stmt = await writeContext(sql, {
		userId,
		kind: "user_statement",
		body: TEST_ONLY_WORDS,
		author: "user",
		source: "verify"
	});
	const inf = await writeContext(sql, {
		userId,
		kind: "agent_inference",
		body: "TEST_ONLY inference — not a fact.",
		author: "role:1",
		source: "verify"
	});
	const corr = await correctContext(sql, {
		userId,
		supersedesId: inf.id,
		body: "TEST_ONLY correction.",
		author: "user"
	});
	const current = await currentOfLineage(sql, userId, inf.lineage_id);
	add("context_kinds", stmt.kind !== inf.kind, `${stmt.kind} vs ${inf.kind}`);
	add("context_correct", current?.id === corr.id, corr.id);
	const art = await createArtifact(sql, {
		userId,
		title: "TEST_ONLY draft",
		kind: "writing",
		body: "v1",
		origin: "user"
	});
	const v2 = await refineArtifact(sql, {
		userId,
		artifactId: art.artifactId,
		body: "v2",
		origin: "user"
	});
	add("artifact_lineage", v2.lineageId === art.lineageId && v2.version === 2, `v${v2.version}`);
	add("mcp_init", "result" in await handleJsonRpc(sql, userId, {
		jsonrpc: "2.0",
		id: 1,
		method: "initialize"
	}), "initialize");
	for (const name of MCP_TOOLS) {
		const res = await handleJsonRpc(sql, userId, {
			jsonrpc: "2.0",
			id: name,
			method: "tools/call",
			params: {
				name,
				arguments: name === "tasks.create" ? {
					roleId: 1,
					title: "TEST_ONLY mcp create",
					requestStatement: TEST_ONLY_WORDS
				} : name === "context.read" ? { roleId: 1 } : {}
			}
		});
		add(`mcp_${name}`, "result" in res, "result" in res ? "ok" : JSON.stringify(res).slice(0, 120));
	}
	const chainStarts = [];
	for (const chain of WORKFLOW_CHAINS) {
		const started = await startChain(sql, {
			userId,
			chainId: chain.id,
			requestStatement: `TEST_ONLY ${chain.id} path. Synthetic only. Do not invent identity.`,
			isTestOnly: true
		});
		chainStarts.push({
			id: chain.id,
			workflowId: started.workflowId,
			firstRole: started.firstTask.role_id,
			packageId: started.firstTask.package_id
		});
		add(`chain_${chain.id}_start`, started.firstTask.role_id === chain.steps[0].roleId && Boolean(started.firstTask.package_id), `role ${started.firstTask.role_id} pkg ${started.firstTask.package_id}`);
	}
	if (llmAvailable()) for (const started of chainStarts) {
		const step = (await driveUntilBlocked(sql, userId, started.workflowId, 1)).steps[0];
		add(`chain_${started.id}_run`, Boolean(step) && (step.status === "done" || step.status === "handed_off" || step.status === "blocked" || step.status === "waiting_approval"), step ? `${step.roleId}:${step.status}${step.blockedReason ? ` ${step.blockedReason}` : ""}` : "no step");
	}
	else add("chain_runs_skipped", false, "LLM unavailable — occupations cannot run");
	const batch = await ingestPhotoBatch(sql, {
		userId,
		sourceType: "selftest",
		purpose: "TEST_ONLY catalog",
		isTestOnly: true,
		files: [{
			filename: "TEST_ONLY_a.png",
			mime: "image/png",
			bytes: makeSolidPng(200, 40, 40, 20, 20)
		}, {
			filename: "TEST_ONLY_b.png",
			mime: "image/png",
			bytes: makeSolidPng(40, 40, 200, 20, 20)
		}]
	});
	add("photo_originals", batch.originalsPreserved && batch.assets.length === 2, batch.batchId);
	add("photo_workflow", Boolean(batch.workflowId), String(batch.workflowId));
	if (batch.workflowId) await drainIntakeQueue(sql, {
		userId,
		limit: 4
	});
	if (batch.assets[0]) {
		const bytes = await getObjectBytes(sql, userId, batch.assets[0].blob_id);
		add("photo_bytes", bytes.byteLength > 0, `${bytes.byteLength} bytes`);
		let locked = false;
		try {
			await tryMutateOriginal(sql, userId, batch.assets[0].blob_id, makeSolidPng(1, 1, 1, 8, 8));
		} catch (e) {
			locked = e instanceof Error && e.message === "ORIGINAL_IMMUTABLE";
		}
		add("photo_write_once", locked, "blocked");
	}
	const tasks = await listTasks(sql, userId);
	const handed = tasks.filter((t) => t.parent_task_id && t.input_json && t.input_json.includes("fromTaskId"));
	add("handoff_exists", handed.length >= 1, `${handed.length} tasks received prior output`);
	add("outputs_exist", tasks.some((t) => t.status === "done" && t.output_json), "at least one finished occupation output");
	const zones = await zoneCensus(sql, userId);
	add("zone_originals", (zones.find((z) => z.zone === "originals")?.count ?? 0) >= 1, String(zones.find((z) => z.zone === "originals")?.count ?? 0));
	add("zone_outputs", (zones.find((z) => z.zone === "outputs")?.count ?? 0) >= 1, String(zones.find((z) => z.zone === "outputs")?.count ?? 0));
	const failed = checks.filter((c) => !c.pass).length;
	const launch = failed === 0 ? "PARTIAL — machines connected in preview. Not a business launch: catalog is PGLite, Stage 15 not sealed, identity gate is off." : `NOT LAUNCHABLE — ${failed} checks failed.`;
	return {
		ok: failed === 0,
		passed: checks.length - failed,
		failed,
		checks,
		launch
	};
}
var Route$2 = createFileRoute("/api/verify")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const userId = await userIdFromRequest(request);
		const result = await runDeskVerify(await getSql(), userId);
		return new Response(JSON.stringify(result), {
			status: result.ok ? 200 : 500,
			headers: { "content-type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({
			ok: false,
			launch: "NOT LAUNCHABLE",
			error: err instanceof Error ? err.message : "verify failed"
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
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
	IndexRoute: Route$17.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$18
	}),
	AgentsRoute: Route$16.update({
		id: "/agents",
		path: "/agents",
		getParentRoute: () => Route$18
	}),
	ContextRoute: Route$15.update({
		id: "/context",
		path: "/context",
		getParentRoute: () => Route$18
	}),
	DocumentsRoute: Route$14.update({
		id: "/documents",
		path: "/documents",
		getParentRoute: () => Route$18
	}),
	IntakeRoute: Route$13.update({
		id: "/intake",
		path: "/intake",
		getParentRoute: () => Route$18
	}),
	LoginRoute: Route$12.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$18
	}),
	MediaRoute: Route$11.update({
		id: "/media",
		path: "/media",
		getParentRoute: () => Route$18
	}),
	OutputsRoute: Route$10.update({
		id: "/outputs",
		path: "/outputs",
		getParentRoute: () => Route$18
	}),
	ReviewRoute: Route$9.update({
		id: "/review",
		path: "/review",
		getParentRoute: () => Route$18
	}),
	SystemRoute: Route$8.update({
		id: "/system",
		path: "/system",
		getParentRoute: () => Route$18
	}),
	WorkRoute: Route$7.update({
		id: "/work",
		path: "/work",
		getParentRoute: () => Route$18
	}),
	ApiHealthRoute: Route$6.update({
		id: "/api/health",
		path: "/api/health",
		getParentRoute: () => Route$18
	}),
	ApiIntakeRoute: Route$5.update({
		id: "/api/intake",
		path: "/api/intake",
		getParentRoute: () => Route$18
	}),
	ApiMcpRoute: Route$4.update({
		id: "/api/mcp",
		path: "/api/mcp",
		getParentRoute: () => Route$18
	}),
	ApiProveRoute: Route$3.update({
		id: "/api/prove",
		path: "/api/prove",
		getParentRoute: () => Route$18
	}),
	ApiVerifyRoute: Route$2.update({
		id: "/api/verify",
		path: "/api/verify",
		getParentRoute: () => Route$18
	}),
	ApiAuthSplatRoute: Route$1.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$18
	}),
	ApiBlobIdRoute: Route.update({
		id: "/api/blob/$id",
		path: "/api/blob/$id",
		getParentRoute: () => Route$18
	})
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { createSsrRpc as n, router_exports as t };
