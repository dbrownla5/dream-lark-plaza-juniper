import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadWork, postResume, postStartChain, postDriveWorkflow } from "@/lib/os/fns";
import { Empty, Panel, Shell, Status } from "@/components/shell";
import { getRole } from "@/lib/os/roles";
import { useAuthedQuery } from "@/hooks/use-authed-query";

export const Route = createFileRoute("/work")({ component: WorkPage });

function WorkPage() {
  const qc = useQueryClient();
  const q = useAuthedQuery("work", () => loadWork());
  const resume = useMutation({
    mutationFn: (taskId: string) => postResume({ data: { taskId } }),
    onSettled: () => qc.invalidateQueries({ queryKey: ["work"] }),
  });
  const start = useMutation({
    mutationFn: (chainId: string) =>
      postStartChain({ data: { chainId, requestStatement: "Start this occupational chain from the desk." } }),
    onSettled: () => qc.invalidateQueries({ queryKey: ["work"] }),
  });
  const drive = useMutation({
    mutationFn: (workflowId: string) => postDriveWorkflow({ data: { workflowId } }),
    onSettled: () => qc.invalidateQueries({ queryKey: ["work"] }),
  });

  return (
    <Shell title="Work" lede="Each chain is a path of occupations. Completing one queues the next. Continue runs the current occupation.">
      {q.data ? (
        <div className="space-y-4">
          <Panel title="Live paths">
            {q.data.paths.length === 0 ? (
              <Empty>No path is running. Bring in a file, or open a chain below.</Empty>
            ) : (
              <ul className="space-y-4">
                {q.data.paths.map((p) => (
                  <li key={p.workflow.id} className="rounded-md border border-border p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium">{p.title}</p>
                      <Status value={p.workflow.status} />
                    </div>
                    <ol className="mt-3 space-y-1 text-sm">
                      {p.steps.map((s) => (
                        <li
                          key={`${p.workflow.id}-${s.index}`}
                          className={s.current ? "text-fg" : "text-muted"}
                        >
                          {s.index + 1}. {s.name}
                          {s.status ? (
                            <>
                              {" "}
                              <Status value={s.status} />
                            </>
                          ) : s.current ? (
                            <span className="text-review"> · current</span>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                    {p.workflow.status === "running" ? (
                      <button
                        type="button"
                        className="mt-3 min-h-11 rounded-md bg-primary px-3 py-2 text-sm text-primary-fg"
                        onClick={() => drive.mutate(p.workflow.id)}
                        disabled={drive.isPending}
                      >
                        Continue this path
                      </button>
                    ) : null}
                    {drive.data && drive.variables === p.workflow.id && drive.data.blockedReason ? (
                      <p className="mt-2 text-sm text-review">{drive.data.blockedReason}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Open a chain">
            <ul className="grid gap-3 sm:grid-cols-2">
              {q.data.chains.map((c) => (
                <li key={c.id} className="rounded-md border border-border p-3">
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-xs text-muted">{c.notes}</p>
                  <p className="mt-2 font-mono text-xs text-muted">
                    {c.steps.map((s) => s.roleId).join(" → ")}
                  </p>
                  <button
                    type="button"
                    className="mt-3 min-h-11 rounded-md border border-border px-3 py-2 text-sm"
                    onClick={() => start.mutate(c.id)}
                    disabled={start.isPending}
                  >
                    Start path
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Tasks">
            {q.data.tasks.length === 0 ? (
              <Empty>No tasks yet.</Empty>
            ) : (
              <ul className="space-y-3">
                {q.data.tasks.map((t) => (
                  <li key={t.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium">{t.title}</p>
                      <Status value={t.status} />
                    </div>
                    <p className="mt-1 text-muted">
                      {roleName(t.role_id)}
                      {t.step_name ? ` · ${t.step_name}` : ""}
                    </p>
                    <p className="mt-2 line-clamp-3">{t.request_statement}</p>
                    {t.interpretation ? (
                      <p className="mt-2 rounded-md bg-bg p-2 text-sm">{t.interpretation}</p>
                    ) : null}
                    {t.output_json ? (
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-subtle">{t.output_json}</pre>
                    ) : null}
                    {t.uncertainty ? <p className="mt-2 text-review">{t.uncertainty}</p> : null}
                    {t.status === "blocked" || t.status === "queued" ? (
                      <button
                        type="button"
                        className="mt-3 min-h-11 rounded-md border border-border px-3 py-2"
                        onClick={() => resume.mutate(t.id)}
                      >
                        Resume
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Finished outputs">
            {q.data.outputs.length === 0 ? (
              <Empty>No occupation has finished an output yet.</Empty>
            ) : (
              <ul className="space-y-3">
                {q.data.outputs.slice(0, 12).map((t) => (
                  <li key={t.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <span>{roleName(t.role_id)}</span>
                      <Status value={t.status} />
                    </div>
                    {t.interpretation ? <p className="mt-2">{t.interpretation}</p> : null}
                    {t.output_json ? (
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-subtle">{t.output_json}</pre>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Approvals">
            {q.data.approvals.length === 0 ? (
              <Empty>Nothing waiting on you.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {q.data.approvals.map((a) => (
                  <li key={a.id}>
                    {a.action_kind} · {a.consequence} <Status value={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      ) : (
        <p className="text-muted">Loading work…</p>
      )}
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
