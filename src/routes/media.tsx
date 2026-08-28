import { createFileRoute } from "@tanstack/react-router";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { loadMedia } from "@/lib/os/fns";
import { Empty, Panel, Shell, Status } from "@/components/shell";

export const Route = createFileRoute("/media")({ component: MediaPage });

function MediaPage() {
  const q = useAuthedQuery("media", () => loadMedia());
  return (
    <Shell
      title="Media"
      lede="Batches, originals, managed names, derivatives, item links, review states. Originals are write-once."
    >
      {q.data ? (
        <div className="space-y-4">
          <Panel title="Containers">
            <ul className="grid gap-2 sm:grid-cols-3 text-sm">
              {(q.data.zones ?? []).map((z) => (
                <li key={z.zone} className="rounded-md border border-border px-3 py-2">
                  <span className="font-medium">{z.zone}</span>
                  <span className="ml-2 font-mono text-xs text-muted">{z.count}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Batches">
            {q.data.batches.length === 0 ? (
              <Empty>No batches. Use Intake — the same pipeline accepts the API.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {q.data.batches.map((b) => (
                  <li key={String(b.id)} className="flex justify-between gap-3">
                    <span>
                      {String(b.id)} · {String(b.source_type)} · {String(b.item_count)} files
                    </span>
                    <Status value={String(b.status)} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Assets">
            {q.data.assets.length === 0 ? (
              <Empty>No catalogued assets.</Empty>
            ) : (
              <ul className="space-y-3">
                {q.data.assets.map((a) => (
                  <li key={String(a.id)} className="rounded-md border border-border p-3 text-sm">
                    <p className="font-medium">{String(a.original_filename)}</p>
                    <p className="text-muted">managed: {String(a.managed_filename)}</p>
                    <p className="mt-1 font-mono text-xs text-subtle">{String(a.checksum_sha256)}</p>
                    <p className="mt-2 flex flex-wrap gap-3 text-xs">
                      <Status value={String(a.review_state)} />
                      <span>quality {String(a.quality_flag)}</span>
                      <span>model {String(a.analysis_model)}</span>
                      {a.duplicate_group ? <span>dup {String(a.duplicate_group)}</span> : null}
                    </p>
                    <a className="mt-2 inline-block text-primary" href={`/api/blob/${a.blob_id}`}>
                      Original
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      ) : (
        <p className="text-muted">Loading catalog…</p>
      )}
    </Shell>
  );
}
