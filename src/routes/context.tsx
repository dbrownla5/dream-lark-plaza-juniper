import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadContext, submitCorrection, sealVoicePillar } from "@/lib/os/fns";
import { Empty, Panel, Shell } from "@/components/shell";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { useState } from "react";

export const Route = createFileRoute("/context")({ component: ContextPage });

function ContextPage() {
  const qc = useQueryClient();
  const q = useAuthedQuery("context", () => loadContext());
  const [target, setTarget] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [slots, setSlots] = useState<[string, string, string]>(["", "", ""]);
  const corr = useMutation({
    mutationFn: () => submitCorrection({ data: { supersedesId: target!, body } }),
    onSuccess: () => {
      setTarget(null);
      setBody("");
      qc.invalidateQueries({ queryKey: ["context"] });
    },
  });
  const voice = useMutation({
    mutationFn: (slot: 1 | 2 | 3) => sealVoicePillar({ data: { slot, body: slots[slot - 1] } }),
    onSuccess: (_d, slot) => {
      setSlots((prev) => {
        const next = [...prev] as [string, string, string];
        next[slot - 1] = "";
        return next;
      });
      qc.invalidateQueries({ queryKey: ["context"] });
    },
  });

  const pillars = q.data?.pillars ?? [];

  return (
    <Shell
      title="Memory"
      lede="Your words, evidence, inference, and corrections stay distinguishable. Voice pillars are occupation 15's sources — not last year's AI."
    >
      <Panel title={`Voice pillars ${pillars.length}/3`}>
        <p className="mb-3 text-sm text-muted">
          Three pieces you actually wrote. Approving one is you saying: write from this. Incoming
          files stay evidence.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {([1, 2, 3] as const).map((slot) => {
            const saved = pillars.find((p) => p.scope === String(slot));
            return (
              <div key={slot} className="rounded-md border border-border p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Letter {slot}</p>
                {saved ? (
                  <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm">{saved.body}</p>
                ) : (
                  <>
                    <textarea
                      className="mt-2 w-full rounded-md border border-border bg-bg px-2 py-2 text-sm"
                      rows={6}
                      value={slots[slot - 1]}
                      onChange={(e) =>
                        setSlots((prev) => {
                          const next = [...prev] as [string, string, string];
                          next[slot - 1] = e.target.value;
                          return next;
                        })
                      }
                      placeholder="Paste a piece you wrote."
                    />
                    <button
                      type="button"
                      className="mt-2 min-h-11 w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-fg"
                      disabled={!slots[slot - 1].trim() || voice.isPending}
                      onClick={() => voice.mutate(slot)}
                    >
                      This is mine
                    </button>
                  </>
                )}
                {voice.error && voice.variables === slot ? (
                  <p className="mt-2 text-sm text-danger">{(voice.error as Error).message}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </Panel>
      {q.data ? (
        <div className="mt-4">
        <Panel title="Records">
          {q.data.records.length === 0 ? (
            <Empty>No living context yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {q.data.records.map((r) => (
                <li key={r.id} className="rounded-md border border-border p-3 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wide text-muted">{r.kind}</span>
                    <span className="text-xs text-subtle">
                      {r.author} · v{r.version_n}
                      {r.superseded_by ? " · superseded" : ""}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{r.body}</p>
                  {r.kind !== "correction" && !r.superseded_by ? (
                    <button
                      type="button"
                      className="mt-2 text-sm text-primary"
                      onClick={() => setTarget(r.id)}
                    >
                      Correct this
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {target ? (
            <form
              className="mt-4 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                corr.mutate();
              }}
            >
              <label className="text-sm" htmlFor="correction">
                Correction (does not erase history)
              </label>
              <textarea
                id="correction"
                className="w-full rounded-md border border-border bg-bg px-3 py-2"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <button type="submit" className="min-h-11 rounded-md bg-primary px-4 py-2 text-primary-fg">
                Record correction
              </button>
            </form>
          ) : null}
        </Panel>
        </div>
      ) : (
        <p className="text-muted">Loading memory…</p>
      )}
    </Shell>
  );
}
