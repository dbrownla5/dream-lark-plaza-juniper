export type OccupationOutput = {
  interpretation?: string;
  output?: unknown;
  evidence?: unknown;
  uncertainty?: string | null;
  handoff_role_id?: number | null;
  needs_approval?: boolean;
  approval_action?: string | null;
  context_note?: string;
};

function asOptionalString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (v == null) return undefined;
  return String(v);
}

function asNullableString(v: unknown): string | null {
  if (typeof v === "string") return v.trim() ? v : null;
  if (v == null) return null;
  return String(v);
}

function asNullableRoleId(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number.parseInt(v, 10) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 40) return null;
  return n;
}

/** Coerce untrusted model output to the exact OccupationOutput shape.
 *  Values that cannot be coerced become null/undefined \u2014 never a wrong type
 *  that would later hit a typed database column. */
function validateOccupationOutput(raw: Record<string, unknown>): OccupationOutput {
  return {
    interpretation: asOptionalString(raw.interpretation),
    output: raw.output,
    evidence: Array.isArray(raw.evidence) ? raw.evidence : raw.evidence != null ? [raw.evidence] : undefined,
    uncertainty: asNullableString(raw.uncertainty),
    handoff_role_id: asNullableRoleId(raw.handoff_role_id),
    needs_approval: raw.needs_approval === true || raw.needs_approval === "true",
    approval_action: asNullableString(raw.approval_action),
    context_note: asOptionalString(raw.context_note),
  };
}

export function parseOccupationOutput(text: string): OccupationOutput {
  const candidates: string[] = [];
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) candidates.push(fenced[1].trim());
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) candidates.push(text.slice(start, end + 1));
  candidates.push(text.trim());

  let last: unknown;
  for (const raw of candidates) {
    const cleaned = raw
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/,\s*([}\]])/g, "$1");
    try {
      const parsed: unknown = JSON.parse(cleaned);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return validateOccupationOutput(parsed as Record<string, unknown>);
      }
    } catch (err) {
      last = err;
    }
  }
  throw last instanceof Error ? last : new Error("NO_JSON");
}
