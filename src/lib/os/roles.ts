/**
 * Forty permanent occupational role contracts.
 * Loaded from TAB 04 of the Dayna MCP/LLM Build Execution Packet (23 Aug 2026).
 * Do not collapse, rename, or implement from summaries.
 */

import packet from "./packet_roles.json" with { type: "json" };

export const ACTION_CLASSES = [
  "READ",
  "ANALYZE",
  "DRAFT",
  "MODIFY",
  "EXECUTE",
  "PUBLISH",
  "SEND",
  "DELETE",
] as const;
export type ActionClass = (typeof ACTION_CLASSES)[number];

export const ROLE_FAMILIES = [
  "navigation",
  "career",
  "writing",
  "business",
  "records",
  "resale",
  "media",
  "technical",
] as const;
export type RoleFamily = (typeof ROLE_FAMILIES)[number];

const GROUP_TO_FAMILY: Record<string, RoleFamily> = {
  navigation_coordination_continuity: "navigation",
  career_and_employment: "career",
  communication_and_writing: "writing",
  business_offers_marketing_content: "business",
  financial_and_operational_records: "records",
  resale_operations: "resale",
  media_and_file_stewardship: "media",
  technical_support_and_evidence_reconstruction: "technical",
};

export type RoleContract = {
  id: number;
  slug: string;
  name: string;
  family: RoleFamily;
  job: string;
  inScope: string;
  outOfScope: string;
  authority: string;
  prohibitions: string;
  prohibitionList: string[];
  inputsOutputs: string;
  requiredSkills: string[];
  tools: string;
  livingModel: string;
  evaluation: string;
  failureBehavior: string;
  separation: string;
  allowedActions: ActionClass[];
  requiresApprovalFor: ActionClass[];
  handoffRoleIds: number[];
};

type PacketRole = {
  number: number;
  id: string;
  name: string;
  group: string;
  permanent_job_and_separate_agent_reason: string;
  in_scope: string[];
  out_of_scope: string[];
  authority: string[];
  prohibitions: string[];
  inputs: string[];
  outputs: string[];
  required_skills: string[];
  future_tools_access: string[];
  living_model_read: string[];
  living_model_write: string[];
  evaluation: string;
  failure_behavior?: string | null;
  proposed_failure_behavior?: string | null;
  separation: string;
};

function join(parts: string[]): string {
  return parts.filter(Boolean).join("; ");
}

function deriveAllowed(role: PacketRole): ActionClass[] {
  const auth = join(role.authority).toLowerCase();
  const prohib = join(role.prohibitions).toLowerCase();
  const allowed: ActionClass[] = ["READ", "ANALYZE"];
  if (/\b(draft|edit|restructure|revise|compose|write|compare versions)\b/.test(auth)) {
    allowed.push("DRAFT");
  }
  const mayModify =
    /\b(modify|update records|ingest|inventory|link originals)\b/.test(auth) &&
    !/\bmay not edit\b/.test(prohib) &&
    !/\bread-only\b/.test(auth);
  if (mayModify) allowed.push("MODIFY");
  return allowed;
}

function mapRole(role: PacketRole): RoleContract {
  const family = GROUP_TO_FAMILY[role.group];
  if (!family) throw new Error(`UNKNOWN_GROUP:${role.group}`);
  const prohibitionList = role.prohibitions.map((p) => p.trim()).filter(Boolean);
  const failure =
    (role.failure_behavior && String(role.failure_behavior).trim()) ||
    (role.proposed_failure_behavior && String(role.proposed_failure_behavior).trim()) ||
    "";
  return {
    id: role.number,
    slug: role.id.replace(/_/g, "-"),
    name: role.name,
    family,
    job: role.permanent_job_and_separate_agent_reason,
    inScope: join(role.in_scope),
    outOfScope: join(role.out_of_scope),
    authority: join(role.authority),
    prohibitions: join(prohibitionList),
    prohibitionList,
    inputsOutputs: `${join(role.inputs)} → ${join(role.outputs)}`,
    requiredSkills: role.required_skills,
    tools: join(role.future_tools_access),
    livingModel: `Read: ${join(role.living_model_read)}. Write: ${join(role.living_model_write)}.`,
    evaluation: role.evaluation,
    failureBehavior: failure,
    separation: role.separation,
    allowedActions: deriveAllowed(role),
    requiresApprovalFor: ["EXECUTE", "PUBLISH", "SEND", "DELETE"],
    handoffRoleIds: [],
  };
}

const packetList = (packet as { roles: PacketRole[] }).roles;
if (!Array.isArray(packetList) || packetList.length !== 40) {
  throw new Error(`PACKET_ROLE_COUNT:${Array.isArray(packetList) ? packetList.length : "invalid"}`);
}

export const ROLES: RoleContract[] = packetList
  .slice()
  .sort((a, b) => a.number - b.number)
  .map(mapRole);

export const ROLE_COUNT = 40;

const byId = new Map(ROLES.map((r) => [r.id, r]));
const bySlug = new Map(ROLES.map((r) => [r.slug, r]));

export function getRole(id: number): RoleContract {
  const r = byId.get(id);
  if (!r) throw new Error(`UNKNOWN_ROLE:${id}`);
  return r;
}

export function getRoleBySlug(slug: string): RoleContract | undefined {
  return bySlug.get(slug);
}

export function assertExactlyFortyRoles(): void {
  if (ROLES.length !== 40) throw new Error(`ROLE_COUNT:${ROLES.length}`);
  const ids = ROLES.map((r) => r.id);
  if (new Set(ids).size !== 40) throw new Error("DUPLICATE_ROLE_ID");
  for (let i = 1; i <= 40; i++) {
    if (!byId.has(i)) throw new Error(`MISSING_ROLE:${i}`);
  }
}

assertExactlyFortyRoles();
