import { useCallback, useEffect, useState } from "react";
import { api, when } from "../api";
import { Button, Card, Empty, Note, Page, Status } from "../ui";

type Task = {
  id: string;
  role_id: number;
  title: string;
  status: string;
  interpretation: string | null;
  uncertainty: string | null;
  created_at: string;
};
type Approval = {
  id: string;
  action_kind: string;
  consequence: string | null;
  created_at: string;
};
type Role = { id: number; name: string };
type State = {
  tasks: Task[];
  approvals: Approval[];
  roles: Role[];
  spend: number;
  ceiling: number;
};

/** What's moving, what stalled, and what is waiting on a decision from her. */
export function Work() {
  const [state, setState] = useState<State | null>(null);
  const load = useCallback(async () => setState(await api.get<State>("/state")), []);

  useEffect(() => {
    load().catch(() => {});
    const t = setInterval(() => load().catch(() => {}), 15000);
    return () => clearInterval(t);
  }, [load]);

  if (!state) return <Page title="Work">Loading…</Page>;

  const roleName = (id: number) => state.roles.find((r) => r.id === id)?.name ?? `Role ${id}`;
  const open = state.tasks.filter((t) => t.status !== "done");
  const done = state.tasks.filter((t) => t.status === "done");

  async function decide(id: string, approve: boolean) {
    await api.post(`/approvals/${id}`, { approve });
    load().catch(() => {});
  }

  return (
    <Page title="Work" lede="Everything in motion, who has it, and what stopped.">
      {state.approvals.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Waiting on you
          </h2>
          <div className="space-y-3">
            {state.approvals.map((a) => (
              <Card key={a.id} className="border-violet-200 bg-violet-50/60">
                <p className="text-[15px] font-medium text-stone-900">
                  {a.consequence ?? `Permission to ${a.action_kind.toLowerCase()}`}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => decide(a.id, true)}>Yes, go ahead</Button>
                  <Button kind="quiet" onClick={() => decide(a.id, false)}>
                    No
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
        In motion
      </h2>
      {open.length === 0 ? (
        <Empty>Nothing running right now.</Empty>
      ) : (
        <div className="space-y-3">
          {open.map((t) => (
            <Card key={t.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-stone-900">{t.title}</p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    {roleName(t.role_id)} · {when(t.created_at)}
                  </p>
                </div>
                <Status value={t.status} />
              </div>
              {t.interpretation && (
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{t.interpretation}</p>
              )}
              {t.uncertainty && <Note>{t.uncertainty}</Note>}
            </Card>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Finished
          </h2>
          <div className="space-y-2">
            {done.slice(0, 12).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <p className="truncate text-[15px] text-stone-700">{t.title}</p>
                <span className="shrink-0 text-sm text-stone-400">{when(t.created_at)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-sm text-stone-500">
        Spent today: ${(state.spend / 100).toFixed(2)} of ${(state.ceiling / 100).toFixed(2)}.
      </p>
    </Page>
  );
}
