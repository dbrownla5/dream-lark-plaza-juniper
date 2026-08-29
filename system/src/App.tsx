import { useCallback, useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  role_id: number;
  title: string;
  status: string;
  interpretation: string | null;
  output_json: string | null;
  uncertainty: string | null;
  created_at: string;
};
type Run = {
  id: string;
  role_id: number;
  model: string | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  blocked_reason: string | null;
};
type Approval = { id: string; action_kind: string; consequence: string | null };
type PathStep = { index: number; roleId: number; name: string; status: string | null; current: boolean };
type WfPath = {
  workflow: { id: string; chain_id: string; status: string };
  title: string;
  steps: PathStep[];
  handoffs: { taskId: string; roleId: number; status: string; title: string }[];
};
type State = {
  ok: boolean;
  llm: string;
  roles: { id: number; name: string; family: string; job: string }[];
  chains: { id: string; title: string; steps: number }[];
  tasks: Task[];
  paths: WfPath[];
  context: { id: string; kind: string; body: string; author: string }[];
  spend: number;
  ceiling: number;
  runs: Run[];
  runTotals: { n: number; cost: number };
  approvals: Approval[];
};

const TABS = ["Today", "Occupations", "Work", "System"] as const;

const STATUS_STYLE: Record<string, string> = {
  done: "bg-emerald-100 text-emerald-800",
  handed_off: "bg-sky-100 text-sky-800",
  running: "bg-amber-100 text-amber-800",
  queued: "bg-stone-200 text-stone-700",
  waiting_approval: "bg-violet-100 text-violet-800",
  blocked: "bg-rose-100 text-rose-800",
  completed: "bg-emerald-100 text-emerald-800",
};

function Status({ value }: { value: string }) {
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-xs ${STATUS_STYLE[value] ?? "bg-stone-200"}`}>
      {value.replace("_", " ")}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-stone-500 uppercase">{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Today");
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statement, setStatement] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/state");
      if (!res.ok) throw new Error(`state ${res.status}`);
      setState(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 8000);
    return () => clearInterval(t);
  }, [refresh]);

  const intake = useCallback(async () => {
    if (!statement.trim() || busy) return;
    setBusy(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `intake ${res.status}`);
      setLastResult(
        json.blockedReason
          ? `Blocked: ${json.blockedReason}`
          : `${json.chainId} chain started — first occupation ${json.firstTask?.status ?? "queued"}.`,
      );
      setStatement("");
      await refresh();
    } catch (e) {
      setLastResult(`Failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }, [statement, busy, refresh]);

  const decide = useCallback(
    async (id: string, approve: boolean) => {
      await fetch(`/api/approvals/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve }),
      });
      await refresh();
    },
    [refresh],
  );

  const drive = useCallback(
    async (workflowId: string) => {
      await fetch(`/api/workflows/${workflowId}/drive`, { method: "POST" });
      await refresh();
    },
    [refresh],
  );

  const roleName = useMemo(() => {
    const map = new Map(state?.roles.map((r) => [r.id, r.name]) ?? []);
    return (id: number) => map.get(id) ?? `role ${id}`;
  }, [state?.roles]);

  const waiting = state?.tasks.filter((t) => t.status === "waiting_approval" || t.status === "blocked") ?? [];
  const active = state?.tasks.filter((t) => t.status === "running" || t.status === "queued") ?? [];
  const done = state?.tasks.filter((t) => t.status === "done" || t.status === "handed_off").slice(0, 8) ?? [];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dayna's System</h1>
          <p className="text-sm text-stone-500">
            {state ? (
              <>
                model <span className="font-mono">{state.llm}</span> · {state.roles.length} occupations · spend{" "}
                {state.spend.toFixed(1)}/{state.ceiling}¢
              </>
            ) : (
              "connecting…"
            )}
          </p>
        </div>
        <nav className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm ${tab === t ? "bg-stone-900 text-white" : "bg-white text-stone-600 hover:bg-stone-200"}`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      {error ? <p className="mb-4 rounded bg-rose-100 p-3 text-sm text-rose-800">Server: {error}</p> : null}

      {tab === "Today" && state && (
        <div className="space-y-4">
          <Panel title="Put work on a desk">
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={3}
              placeholder="Say what you need in your own words. The system routes it to the right occupational chain and the first occupation works it now."
              className="w-full rounded-lg border border-stone-300 p-3 text-sm"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={intake}
                disabled={busy || !statement.trim()}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                {busy ? "Working…" : "Start work"}
              </button>
              {lastResult ? <span className="text-sm text-stone-600">{lastResult}</span> : null}
            </div>
          </Panel>

          <Panel title="Waiting on you">
            {waiting.length === 0 && (state.approvals?.length ?? 0) === 0 ? (
              <p className="text-sm text-stone-500">Nothing is waiting on you.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {state.approvals.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2">
                    <span>
                      {a.action_kind}: {a.consequence}
                    </span>
                    <span className="flex gap-2">
                      <button onClick={() => decide(a.id, true)} className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">
                        Approve
                      </button>
                      <button onClick={() => decide(a.id, false)} className="rounded bg-rose-600 px-2 py-1 text-xs text-white">
                        Deny
                      </button>
                    </span>
                  </li>
                ))}
                {waiting.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2">
                    <span>
                      {t.title} · {roleName(t.role_id)}
                      {t.uncertainty ? <span className="block text-xs text-stone-500">{t.uncertainty}</span> : null}
                    </span>
                    <Status value={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Active">
            {active.length === 0 ? (
              <p className="text-sm text-stone-500">No running work.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {active.map((t) => (
                  <li key={t.id} className="flex justify-between gap-2">
                    <span>
                      {t.title} · {roleName(t.role_id)}
                    </span>
                    <Status value={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Done">
            {done.length === 0 ? (
              <p className="text-sm text-stone-500">No finished occupations yet.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {done.map((t) => (
                  <li key={t.id} className="rounded-lg border border-stone-200 p-3">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">
                        {t.title} · {roleName(t.role_id)}
                      </span>
                      <Status value={t.status} />
                    </div>
                    {t.interpretation ? <p className="mt-1 text-stone-600">{t.interpretation}</p> : null}
                    {t.output_json && t.output_json !== "{}" ? (
                      <pre className="mt-2 overflow-x-auto rounded bg-stone-50 p-2 text-xs whitespace-pre-wrap">
                        {t.output_json}
                      </pre>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {tab === "Occupations" && state && (
        <div className="grid gap-3 sm:grid-cols-2">
          {state.roles.map((r) => (
            <div key={r.id} className="rounded-xl border border-stone-200 bg-white p-3">
              <p className="text-sm font-semibold">
                {r.id}. {r.name}
              </p>
              <p className="text-xs text-stone-500">{r.family}</p>
              <p className="mt-1 text-xs text-stone-600">{r.job}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "Work" && state && (
        <div className="space-y-4">
          {state.paths.length === 0 ? (
            <Panel title="Workflows">
              <p className="text-sm text-stone-500">No workflows yet. Start one from Today.</p>
            </Panel>
          ) : (
            state.paths.map((p) => (
              <Panel key={p.workflow.id} title={`${p.title}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Status value={p.workflow.status} />
                  {p.workflow.status === "running" ? (
                    <button
                      onClick={() => drive(p.workflow.id)}
                      className="rounded bg-stone-900 px-2 py-1 text-xs text-white"
                    >
                      Run next step
                    </button>
                  ) : null}
                </div>
                <ol className="flex flex-wrap gap-2 text-xs">
                  {p.steps.map((s) => (
                    <li
                      key={s.index}
                      className={`rounded-lg border px-2 py-1 ${s.current ? "border-stone-900" : "border-stone-200"}`}
                    >
                      {s.name} {s.status ? <Status value={s.status} /> : <span className="text-stone-400">pending</span>}
                    </li>
                  ))}
                </ol>
                {p.handoffs.length > 0 ? (
                  <p className="mt-2 text-xs text-stone-500">
                    Handoffs: {p.handoffs.map((h) => `${h.title} (${h.status})`).join(", ")}
                  </p>
                ) : null}
              </Panel>
            ))
          )}
        </div>
      )}

      {tab === "System" && state && (
        <div className="space-y-4">
          <Panel title="Run ledger — every model call, kept">
            <p className="mb-2 text-xs text-stone-500">
              {state.runTotals.n} runs · {state.runTotals.cost.toFixed(2)}¢ total
            </p>
            {state.runs.length === 0 ? (
              <p className="text-sm text-stone-500">No runs recorded yet.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {state.runs.map((r) => (
                  <li key={r.id} className="flex justify-between gap-2">
                    <span>
                      {roleName(r.role_id)} · {r.model ?? "no provider call"}
                      {r.blocked_reason ? <span className="text-rose-700"> · {r.blocked_reason.slice(0, 60)}</span> : null}
                    </span>
                    <span className="font-mono text-xs text-stone-500">
                      {r.prompt_tokens != null ? `${r.prompt_tokens}+${r.completion_tokens} tok` : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Living context (latest)">
            <ul className="space-y-2 text-sm">
              {state.context.map((c) => (
                <li key={c.id}>
                  <span className="font-mono text-xs text-stone-500">{c.kind}</span> {c.body.slice(0, 160)}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </div>
  );
}
