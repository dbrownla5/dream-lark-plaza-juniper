import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadSystem, postMcpToken, postQualify, postSelfTest } from "@/lib/os/fns";
import { Empty, Panel, Shell } from "@/components/shell";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { useState } from "react";

export const Route = createFileRoute("/system")({ component: SystemPage });

function SystemPage() {
  const qc = useQueryClient();
  const q = useAuthedQuery("system", () => loadSystem());
  const [token, setToken] = useState<string | null>(null);
  const selftest = useMutation({
    mutationFn: () => postSelfTest(),
    onSettled: () => qc.invalidateQueries({ queryKey: ["system"] }),
  });
  const qualify = useMutation({
    mutationFn: () => postQualify(),
    onSettled: () => qc.invalidateQueries({ queryKey: ["system"] }),
  });
  const mint = useMutation({
    mutationFn: () => postMcpToken({ data: { label: "desk-client" } }),
    onSuccess: (r) => setToken(r.token),
  });

  return (
    <Shell
      title="System"
      lede="Deployment, providers, errors, queues, cost, and synthetic construction checks. Status remains PARTIAL until Stage 15."
    >
      {q.data ? (
        <div className="space-y-4">
          <Panel title="Storage containers">
            <p className="mb-3 text-sm text-muted">
              Live zones on this server. Originals are write-once after checksum. Empty is still a container.
            </p>
            <ul className="grid gap-2 sm:grid-cols-3">
              {(q.data.zones ?? []).map((z) => (
                <li key={z.zone} className="rounded-md border border-border px-3 py-2 text-sm">
                  <p className="font-medium">{z.zone}</p>
                  <p className="font-mono text-xs text-muted">
                    {z.count} objects · {z.bytes} B
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Health">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted">Status</dt>
              <dd className="font-mono">{q.data.status}</dd>
              <dt className="text-muted">Catalog</dt>
              <dd className="font-mono">{q.data.db}</dd>
              <dt className="text-muted">Model</dt>
              <dd className="font-mono">{q.data.llm}</dd>
              <dt className="text-muted">Spend</dt>
              <dd className="font-mono">
                {q.data.spend.toFixed(1)} / {q.data.ceiling} ¢
              </dd>
              <dt className="text-muted">Adapters</dt>
              <dd className="font-mono">{q.data.adapters.join(", ")}</dd>
            </dl>
            {q.data.health?.payload_json ? (
              <pre className="mt-3 overflow-x-auto text-xs text-subtle">{q.data.health.payload_json}</pre>
            ) : null}
          </Panel>
          <Panel title="Errors">
            {q.data.errors.length === 0 ? (
              <Empty>No blocked events recorded.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {q.data.errors.map((e) => (
                  <li key={String(e.id)}>
                    <span className="font-mono text-xs">{String(e.kind)}</span> {String(e.body)}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Construction checks">
            <p className="text-sm text-muted">
              Synthetic fixtures only — geometric images and TEST_ONLY text. Never your corpus.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm text-primary-fg"
                onClick={() => selftest.mutate()}
                disabled={selftest.isPending}
              >
                Run synthetic checks
              </button>
              <button
                type="button"
                className="min-h-11 rounded-md border border-border px-4 py-2 text-sm"
                onClick={() => qualify.mutate()}
                disabled={qualify.isPending}
              >
                Qualify mechanical skills
              </button>
              <button
                type="button"
                className="min-h-11 rounded-md border border-border px-4 py-2 text-sm"
                onClick={() => mint.mutate()}
              >
                Issue MCP token
              </button>
            </div>
            {selftest.data ? (
              <ul className="mt-4 space-y-1 text-sm">
                {selftest.data.checks.map((c) => (
                  <li key={c.id} className={c.pass ? "text-ok" : "text-danger"}>
                    {c.pass ? "pass" : "fail"} · {c.id} · {c.detail}
                  </li>
                ))}
                <li className="pt-2 text-muted">
                  {selftest.data.passed} passed · {selftest.data.failed} failed
                </li>
              </ul>
            ) : null}
            {token ? (
              <p className="mt-3 break-all font-mono text-xs">
                Token shown once: {token}
              </p>
            ) : null}
          </Panel>
        </div>
      ) : (
        <p className="text-muted">Loading system…</p>
      )}
    </Shell>
  );
}
