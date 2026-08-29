import { createFileRoute } from "@tanstack/react-router";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { loadOutputs } from "@/lib/os/fns";
import { Empty, Panel, Shell, Status } from "@/components/shell";
import { getRole } from "@/lib/os/roles";

export const Route = createFileRoute("/outputs")({ component: OutputsPage });

function OutputsPage() {
  const q = useAuthedQuery("outputs", () => loadOutputs());
  return (
    <Shell title="Outputs" lede="Completed work, versions, evidence references, restart and reuse paths.">
      {q.data ? (
        <div className="space-y-4">
          <Panel title="Deliverables">
            {q.data.outputs.length === 0 ? (
              <Empty>No completed occupational outputs yet.</Empty>
            ) : (
              <ul className="space-y-3">
                {q.data.outputs.map((o) => (
                  <li key={String(o.id)} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <p className="font-medium">{String(o.title)}</p>
                      <Status value={String(o.status)} />
                    </div>
                    <p className="text-muted">{safeRole(Number(o.role_id))}</p>
                    {o.output_json ? (
                      <pre className="mt-2 overflow-x-auto text-xs text-subtle">{String(o.output_json)}</pre>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Artifact lineages">
            {q.data.artifacts.length === 0 ? (
              <Empty>No versioned artifacts.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {q.data.artifacts.map((a) => (
                  <li key={String(a.id)} className="rounded-md border border-border p-3">
                    <p className="font-medium">
                      {String(a.title)} · {String(a.kind)} · v{String(a.current_version)}
                    </p>
                    {a.body ? (
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-subtle">{String(a.body)}</pre>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      ) : (
        <p className="text-muted">Loading outputs…</p>
      )}
    </Shell>
  );
}

function safeRole(id: number) {
  try {
    return getRole(id).name;
  } catch {
    return `role ${id}`;
  }
}
