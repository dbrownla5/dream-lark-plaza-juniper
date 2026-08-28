import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadAgents, postRunRole } from "@/lib/os/fns";
import { Empty, Panel, Shell, Status } from "@/components/shell";
import { useState } from "react";
import { useAuthedQuery } from "@/hooks/use-authed-query";

export const Route = createFileRoute("/agents")({ component: AgentsPage });

function AgentsPage() {
  const q = useAuthedQuery("agents", () => loadAgents());
  const qc = useQueryClient();
  const [open, setOpen] = useState<number | null>(null);
  const [request, setRequest] = useState("");
  const run = useMutation({
    mutationFn: () => postRunRole({ data: { roleId: open!, requestStatement: request } }),
    onSettled: () => qc.invalidateQueries({ queryKey: ["agents"] }),
  });

  return (
    <Shell
      title="Occupations"
      lede="Forty permanent occupations from your packet. They are not project-married bots. You pick one. It confirms the contract. Then it works."
    >
      {q.data ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Skills qualified {q.data.skillCounts.qualified} · candidate {q.data.skillCounts.candidate} · blocked{" "}
            {q.data.skillCounts.blocked}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {q.data.roles.map((r) => (
              <Panel
                key={r.id}
                title={`${r.id}. ${r.name}`}
                action={<span className="text-xs uppercase tracking-wide text-muted">{r.family}</span>}
              >
                <p className="text-sm text-muted">{r.job}</p>
                <p className="mt-2 text-xs text-subtle">Out of scope: {r.outOfScope}</p>
                {r.current.length ? (
                  <ul className="mt-3 space-y-1 text-sm">
                    {r.current.map((t) => (
                      <li key={t.id}>
                        {t.title} <Status value={t.status} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-3">
                    <Empty>No current bounded work.</Empty>
                  </div>
                )}
                <button
                  type="button"
                  className="mt-3 min-h-11 rounded-md border border-border px-3 py-2 text-sm"
                  onClick={() => setOpen(r.id)}
                >
                  Assign work
                </button>
                {open === r.id ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted">
                      In scope: {r.inScope}. Prohibitions: {r.prohibitions}
                    </p>
                    <textarea
                      className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm"
                      rows={3}
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      placeholder="Exact request. Your words stay yours."
                    />
                    <button
                      type="button"
                      className="min-h-11 rounded-md bg-primary px-3 py-2 text-sm text-primary-fg"
                      onClick={() => run.mutate()}
                      disabled={!request.trim() || run.isPending}
                    >
                      Put it on this desk
                    </button>
                    {run.data?.blockedReason ? (
                      <p className="text-sm text-review">{run.data.blockedReason}</p>
                    ) : null}
                  </div>
                ) : null}
              </Panel>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted">Loading occupations…</p>
      )}
    </Shell>
  );
}
