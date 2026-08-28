import { getRole, type ActionClass } from "./roles.ts";

const SECRET_PATTERNS: RegExp[] = [
  /xai[_-]?api[_-]?key/i,
  /api[_-]?key\s*[:=]/i,
  /bearer\s+[a-z0-9._\-]+/i,
  /password\s*[:=]/i,
  /database_url/i,
  /secret\s*[:=]/i,
  /\bsk-[a-zA-Z0-9]{10,}/,
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
];

export function containsSecret(text: string): boolean {
  return SECRET_PATTERNS.some((re) => re.test(text));
}

export function redactSecrets(text: string): string {
  let out = text;
  for (const re of SECRET_PATTERNS) {
    out = out.replace(re, "[REDACTED]");
  }
  return out;
}

export type GuardDecision =
  | { ok: true }
  | { ok: false; code: string; message: string };

export function assertActionAllowed(roleId: number, action: ActionClass): GuardDecision {
  const role = getRole(roleId);
  if (!role.allowedActions.includes(action)) {
    return {
      ok: false,
      code: "ACTION_FORBIDDEN",
      message: `${role.name} may not ${action}. ${role.prohibitions}`,
    };
  }
  return { ok: true };
}

export function assertApprovalNeeded(roleId: number, action: ActionClass): boolean {
  const role = getRole(roleId);
  return role.requiresApprovalFor.includes(action);
}

export function assertToolAllowed(
  roleId: number,
  tool: string,
  qualifiedTools: string[],
): GuardDecision {
  if (!qualifiedTools.includes(tool)) {
    return {
      ok: false,
      code: "TOOL_UNQUALIFIED",
      message: `Role ${roleId} is not qualified for tool ${tool}`,
    };
  }
  return { ok: true };
}

export function detectCircularHandoff(path: number[], nextRoleId: number): GuardDecision {
  if (path.includes(nextRoleId)) {
    const last = path[path.length - 1];
    if (last === nextRoleId || path.slice(-3).includes(nextRoleId)) {
      return {
        ok: false,
        code: "CIRCULAR_HANDOFF",
        message: `Handoff path ${path.join("→")} → ${nextRoleId} is circular`,
      };
    }
  }
  const pair = `${path[path.length - 1]}>${nextRoleId}`;
  const back = `${nextRoleId}>${path[path.length - 1]}`;
  const joined = path.join(">");
  if (joined.includes(back) && path.includes(nextRoleId)) {
    return {
      ok: false,
      code: "CIRCULAR_HANDOFF",
      message: `Handoff ${pair} reverses an earlier assignment without new evidence`,
    };
  }
  return { ok: true };
}

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

/** Paraphrases that have already slipped token-overlap denylists. Fail closed. */
const PARAPHRASE_RULES: { id: string; when: RegExp; hits: RegExp }[] = [
  {
    id: "guarantee_sale",
    when: /guarantee|sale|sell|listing|price|seller/,
    hits: /guarantee.{0,40}sell|promise.{0,40}sell|definitely sell|will sell today|guaranteed to sell|this will (definitely|surely) sell/,
  },
  {
    id: "overwrite_original",
    when: /overwrite|original/,
    hits: /overwrite.{0,20}original|replace the original|save over the original|destructive rename/,
  },
  {
    id: "unapproved_voice",
    when: /voice|imitate|unapproved|ai-generated|ai generated/,
    hits: /learn.{0,20}voice from (unapproved|ai)|imitate.{0,20}(ai|unapproved)|write as her from (resume|old ai)/,
  },
  {
    id: "publish_without_approval",
    when: /publish|send|pay|payout|listing/,
    hits: /publish (now|anyway|without)|send (it|this) (now|without approval)|pay (them|out) now|go live without/,
  },
];

export function assertProhibitedSpeech(roleId: number, text: string): GuardDecision {
  const role = getRole(roleId);
  const hay = text.toLowerCase();
  const prohibitions = role.prohibitionList.length
    ? role.prohibitionList
    : role.prohibitions.split(";").map((s) => s.trim()).filter(Boolean);

  for (const rule of PARAPHRASE_RULES) {
    const relevant = rule.when.test(`${role.name} ${role.job} ${role.prohibitions}`);
    if (relevant && rule.hits.test(hay)) {
      return {
        ok: false,
        code: "PROHIBITION_PARAPHRASE",
        message: `${role.name} refused: this request paraphrases a prohibition (${rule.id}). ${role.prohibitions}`,
      };
    }
  }

  for (const p of prohibitions) {
    const pTok = tokens(p.replace(/^may not\s+/i, ""));
    const tTok = tokens(hay);
    if (pTok.size < 2) continue;
    let hit = 0;
    for (const w of pTok) if (tTok.has(w)) hit += 1;
    if (hit / pTok.size >= 0.7) {
      return {
        ok: false,
        code: "PROHIBITION_OVERLAP",
        message: `${role.name} refused: request overlaps prohibition "${p}".`,
      };
    }
  }
  return { ok: true };
}

export function sanitizeForAgentContext(input: {
  userStatement?: string;
  other?: string;
}): { userStatement: string; other: string } {
  return {
    userStatement: redactSecrets(input.userStatement ?? ""),
    other: redactSecrets(input.other ?? ""),
  };
}

export function assertNoFabricatedSuccess(status: string, blockedReason: string | null): GuardDecision {
  if (status === "done" && blockedReason) {
    return {
      ok: false,
      code: "FABRICATED_SUCCESS",
      message: "A blocked run cannot be marked done",
    };
  }
  return { ok: true };
}
