import { createFileRoute, Link } from "@tanstack/react-router";
import { loadHome } from "@/lib/os/fns";
import { Empty, Panel, Shell, Status } from "@/components/shell";
import { IntakeForm } from "@/components/intake-form";
import { getRole } from "@/lib/os/roles";
import { useAuthedQuery } from "@/hooks/use-authed-query";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const q = useAuthedQuery("home", () => loadHome());
  return (
    <Shell title="Today" lede="You talk. Occupations wait until you put work on a desk. Files are preserved first.">
      <div className="mb-6">
        <IntakeForm />
      </div>
      {q.isPending ? <p className="text-muted">Loading the floor…</p> : null}
      {q.error ? <p className="text-danger">{(q.error as Error).message}</p> : null}
      {q.data ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="Waiting on you">
            {q.data.waiting.length === 0 && q.data.approvals.length === 0 ? (
              <Empty>Nothing is waiting on you.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {q.data.approvals.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3">
                    <span>{a.consequence}</span>
                    <Link to="/review" className="text-primary">
                      Review
                    </Link>
                  </li>
                ))}
                {q.data.waiting.map((t) => (
                  <li key={t.id} className="flex items-start justify-between gap-3">
                    <span>
                      {t.title} <Status value={t.status} />
                    </span>
                    <Link to="/work" className="text-primary">
                      Open
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Active work">
            {q.data.active.length === 0 ? (
              <Empty>No running work. Occupations stay still until you put something on a desk.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {q.data.active.map((t) => (
                  <li key={t.id}>
                    <span className="text-muted">{roleName(t.role_id)} · </span>
                    {t.title} <Status value={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel
            title="Last outputs"
            action={
              <Link to="/work" className="text-sm text-primary">
                Work
              </Link>
            }
          >
            {q.data.done.length === 0 ? (
              <Empty>No occupation has finished yet. Put work on a desk under Occupations.</Empty>
            ) : (
              <ul className="space-y-3 text-sm">
                {q.data.done.map((t) => (
                  <li key={t.id} className="rounded-md border border-border p-3">
                    <div className="flex justify-between gap-2">
                      <span>{roleName(t.role_id)}</span>
                      <Status value={t.status} />
                    </div>
                    {t.interpretation ? <p className="mt-2">{t.interpretation}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel
            title="Memory"
            action={
              <Link to="/context" className="text-sm text-primary">
                Open
              </Link>
            }
          >
            {q.data.context.length === 0 ? (
              <Empty>Nothing sealed yet. Talk above, or drop files under Bring in.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {q.data.context.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <span className="font-mono text-xs text-muted">{c.kind}</span>
                    <p className="line-clamp-2">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="System">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted">Model</dt>
              <dd className="font-mono">{q.data.llm}</dd>
              <dt className="text-muted">Catalog</dt>
              <dd className="font-mono">{q.data.db}</dd>
              <dt className="text-muted">Spend today</dt>
              <dd className="font-mono">
                {q.data.spend.toFixed(1)} / {q.data.ceiling} ¢
              </dd>
              <dt className="text-muted">Occupations</dt>
              <dd className="font-mono">{q.data.roleCount}</dd>
            </dl>
            {q.data.zones ? (
              <p className="mt-3 font-mono text-xs text-muted">
                originals {q.data.zones.find((z) => z.zone === "originals")?.count ?? 0} · intake{" "}
                {q.data.zones.find((z) => z.zone === "intake")?.count ?? 0} · derivatives{" "}
                {q.data.zones.find((z) => z.zone === "derivatives")?.count ?? 0}
              </p>
            ) : null}
            {q.data.paths?.length ? (
              <p className="mt-2 text-sm">
                {q.data.paths.filter((p) => p.workflow.status === "running").length} path
                {q.data.paths.filter((p) => p.workflow.status === "running").length === 1 ? "" : "s"} running
              </p>
            ) : null}
            {q.data.llm === "UNAVAILABLE" ? (
              <p className="mt-3 text-sm text-review">
                Occupations cannot think until the language model is available. Files still preserve.
              </p>
            ) : null}
            <p className="mt-3 text-xs text-muted">
              Photos, documents, and outputs stay on those records. Nothing here is marked WORKING.
            </p>
          </Panel>
        </div>
      ) : null}
    </Shell>
  );
}

function roleName(id: number) {
  try {
    return getRole(id).name;
  } catch {
    return `role ${id}`;
  }
}
