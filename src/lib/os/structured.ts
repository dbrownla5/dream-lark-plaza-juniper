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
      const parsed = JSON.parse(cleaned) as OccupationOutput;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch (err) {
      last = err;
    }
  }
  throw last instanceof Error ? last : new Error("NO_JSON");
}
