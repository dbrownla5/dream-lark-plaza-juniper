import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadReview, postApproval } from "@/lib/os/fns";
import { Empty, Panel, Shell, Status } from "@/components/shell";
import { useAuthedQuery } from "@/hooks/use-authed-query";

export const Route = createFileRoute("/review")({ component: ReviewPage });

function ReviewPage() {
  const qc = useQueryClient();
  const q = useAuthedQuery("review", () => loadReview());
  const decide = useMutation({
    mutationFn: (input: { approvalId: string; status: "approved" | "denied" }) =>
      postApproval({ data: input }),
    onSettled: () => qc.invalidateQueries({ queryKey: ["review"] }),
  });

  return (
    <Shell title="Review" lede="Pending decisions and their consequences. Nothing executes before approval when required.">
      {q.data ? (
        <div className="space-y-4">
          <Panel title="Approvals">
            {q.data.approvals.length === 0 ? (
              <Empty>No approval records.</Empty>
            ) : (
              <ul className="space-y-3">
                {q.data.approvals.map((a) => (
                  <li key={String(a.id)} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <p>{String(a.consequence)}</p>
                      <Status value={String(a.status)} />
                    </div>
                    <p className="mt-1 text-muted">{String(a.action_kind)}</p>
                    {a.status === "pending" ? (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="min-h-11 rounded-md bg-primary px-3 py-2 text-primary-fg"
                          onClick={() => decide.mutate({ approvalId: String(a.id), status: "approved" })}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="min-h-11 rounded-md border border-border px-3 py-2"
                          onClick={() => decide.mutate({ approvalId: String(a.id), status: "denied" })}
                        >
                          Deny
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Uncertain media">
            {q.data.media.length === 0 ? <Empty>No media in review.</Empty> : (
              <ul className="space-y-2 text-sm">
                {q.data.media.map((m) => (
                  <li key={String(m.id)}>
                    {String(m.original_filename)} · {String(m.quality_flag)} · {String(m.analysis_model)}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Uncertain documents">
            {q.data.docs.length === 0 ? <Empty>No documents in review.</Empty> : (
              <ul className="space-y-2 text-sm">
                {q.data.docs.map((d) => (
                  <li key={String(d.id)}>
                    {String(d.original_filename)} · {String(d.classification)}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Blocked work">
            {q.data.blocked.length === 0 ? <Empty>No blocked tasks.</Empty> : (
              <ul className="space-y-2 text-sm">
                {q.data.blocked.map((t) => (
                  <li key={String(t.id)}>
                    {String(t.title)} <Status value={String(t.status)} />
                    <span className="block text-review">{String(t.uncertainty ?? "")}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      ) : (
        <p className="text-muted">Loading review…</p>
      )}
    </Shell>
  );
}
