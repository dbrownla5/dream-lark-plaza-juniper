import { useCallback, useEffect, useState } from "react";
import { api, when, type LivingRecord } from "../api";
import { Button, Empty, Page } from "../ui";

const KIND_LABEL: Record<string, string> = {
  user_statement: "You said this",
  correction: "You corrected this",
  decision: "Decided",
  preference: "How you like it",
  verified_fact: "Checked and true",
  external_evidence: "Evidence",
  agent_inference: "An agent concluded this",
  calculation: "Worked out",
  temporary_idea: "Thinking out loud",
  processing_aloud: "Thinking out loud",
  unfinished_work: "Unfinished",
  superseded_state: "Replaced",
};

const MINE = new Set(["user_statement", "correction", "decision", "preference"]);

/**
 * What the system thinks it knows, and where each piece came from. Her words
 * and an agent's conclusions are never shown as the same kind of thing, and
 * anything here can be corrected without erasing what it used to say.
 */
export function Memory() {
  const [records, setRecords] = useState<LivingRecord[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | "mine" | "theirs">("all");

  const load = useCallback(async () => {
    const r = await api.get<{ context: LivingRecord[] }>("/context");
    setRecords(r.context);
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const shown = records.filter((r) => {
    if (r.superseded_by) return false;
    if (filter === "mine") return MINE.has(r.kind);
    if (filter === "theirs") return !MINE.has(r.kind);
    return true;
  });

  async function correct(id: string) {
    const body = draft.trim();
    if (!body) return;
    await api.post(`/context/${id}/correct`, { body });
    setEditing(null);
    setDraft("");
    load().catch(() => {});
  }

  return (
    <Page
      title="What it remembers"
      lede="Everything the agents work from. Your words stay marked as yours. Anything an agent concluded is labeled a conclusion — and if it's wrong, fix it here and the correction carries forward without deleting the history."
    >
      <div className="mb-6 flex gap-2">
        {(
          [
            ["all", "Everything"],
            ["mine", "From you"],
            ["theirs", "Concluded by agents"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              filter === k
                ? "bg-stone-900 text-white"
                : "border border-stone-300 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <Empty>Nothing yet. Anything you say in chat lands here.</Empty>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => {
            const mine = MINE.has(r.kind);
            return (
              <div
                key={r.id}
                className={`rounded-2xl border p-4 ${
                  mine ? "border-stone-300 bg-white" : "border-stone-200 bg-stone-50/70"
                }`}
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      mine ? "text-stone-700" : "text-stone-400"
                    }`}
                  >
                    {KIND_LABEL[r.kind] ?? r.kind.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-stone-400">{when(r.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-stone-800">
                  {r.body}
                </p>

                {editing === r.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={3}
                      placeholder="What's actually true?"
                      className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-[15px] outline-none focus:border-stone-500"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => correct(r.id)} disabled={!draft.trim()}>
                        Save correction
                      </Button>
                      <Button kind="quiet" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(r.id);
                      setDraft("");
                    }}
                    className="mt-3 text-sm font-medium text-stone-500 hover:text-stone-900"
                  >
                    That's wrong — fix it
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
}
