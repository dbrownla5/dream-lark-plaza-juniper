/** Machine-readable requirement IDs from packet TAB 03 / stages 01–13. */

export const REQUIREMENTS = [
  { id: "R-SRV-01", title: "Remote production server", family: "server" },
  { id: "R-WEB-01", title: "Live web dashboard application", family: "dashboard" },
  { id: "R-WEB-02", title: "Home / daily view", family: "dashboard" },
  { id: "R-WEB-03", title: "Intake surface", family: "dashboard" },
  { id: "R-WEB-04", title: "Active work / workflows", family: "dashboard" },
  { id: "R-WEB-05", title: "Agents directory", family: "dashboard" },
  { id: "R-WEB-06", title: "Media catalog", family: "dashboard" },
  { id: "R-WEB-07", title: "Documents catalog", family: "dashboard" },
  { id: "R-WEB-08", title: "Review and approvals", family: "dashboard" },
  { id: "R-WEB-09", title: "Living context / corrections", family: "dashboard" },
  { id: "R-WEB-10", title: "Outputs / history", family: "dashboard" },
  { id: "R-WEB-11", title: "System health / connections", family: "dashboard" },
  { id: "R-MCP-01", title: "MCP server same production state", family: "mcp" },
  { id: "R-MCP-02", title: "MCP auth fail-closed", family: "mcp" },
  { id: "R-LLM-01", title: "Real LLM provider, fail visible", family: "llm" },
  { id: "R-GRD-01", title: "Guardrail / permission engine", family: "guardrails" },
  { id: "R-GRD-02", title: "Approval-required actions stop", family: "guardrails" },
  { id: "R-GRD-03", title: "Secrets never enter agent context", family: "guardrails" },
  { id: "R-ROL-01", title: "Exactly 40 occupational contracts", family: "roles" },
  { id: "R-SKL-01", title: "Skills + qualification evidence", family: "skills" },
  { id: "R-RUN-01", title: "Agent runner + handoffs", family: "runtime" },
  { id: "R-RUN-02", title: "Failure is visible, never fake success", family: "runtime" },
  { id: "R-STO-01", title: "Remote storage containers / zones", family: "storage" },
  { id: "R-STO-02", title: "Originals write-once after checksum", family: "storage" },
  { id: "R-PHO-01", title: "Photo intake / catalog pipeline", family: "photo" },
  { id: "R-DOC-01", title: "Document intake pipeline", family: "documents" },
  { id: "R-CTX-01", title: "Living context typed records", family: "context" },
  { id: "R-CTX-02", title: "Correction propagation with history", family: "context" },
  { id: "R-APR-01", title: "Approval / review states", family: "approvals" },
  { id: "R-REC-01", title: "Failure / recovery snapshots", family: "recovery" },
  { id: "R-XDV-01", title: "Cross-device server persistence", family: "persistence" },
  { id: "R-NEG-01", title: "No localhost as production", family: "negative" },
  { id: "R-NEG-02", title: "No mocked production runner", family: "negative" },
  { id: "R-NEG-03", title: "No browser-only authoritative state", family: "negative" },
  { id: "R-NEG-04", title: "No destructive original mutation", family: "negative" },
  { id: "R-NEG-05", title: "No unauthorized occupational action", family: "negative" },
  { id: "R-NEG-06", title: "No unsupported certainty", family: "negative" },
  { id: "R-WF-CAREER", title: "Career workflow chain", family: "workflows" },
  { id: "R-WF-WRITE", title: "Writing / correspondence chain", family: "workflows" },
  { id: "R-WF-BIZ", title: "Business / marketing chain", family: "workflows" },
  { id: "R-WF-FIN", title: "Financial records separation", family: "workflows" },
  { id: "R-WF-RESALE", title: "Resale occupational chain", family: "workflows" },
  { id: "R-WF-MEDIA", title: "Media custody vs derivatives", family: "workflows" },
  { id: "R-WF-TECH", title: "Technical diagnosis vs implementation", family: "workflows" },
  { id: "R-WF-FOR", title: "Forensic timeline evidence rules", family: "workflows" },
] as const;

export type RequirementId = (typeof REQUIREMENTS)[number]["id"];

export const DEPLOY_ADAPTERS = [
  {
    id: "vercel",
    label: "Vercel HTTPS web application",
    localhostProduction: false,
    cloudflare: false,
  },
  {
    id: "node-host",
    label: "Generic Node HTTPS host (Nitro node-server)",
    localhostProduction: false,
    cloudflare: false,
  },
] as const;

export function assertNoLocalhostProduction(url: string | undefined): void {
  if (!url) return;
  const u = url.toLowerCase();
  if (u.includes("localhost") || u.includes("127.0.0.1") || u.includes("0.0.0.0")) {
    throw new Error("LOCALHOST_IS_NOT_PRODUCTION");
  }
}

export function productionUrlFromEnv(): string | undefined {
  return (
    process.env.PRODUCTION_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    undefined
  );
}
