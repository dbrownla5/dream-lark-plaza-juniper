import { createFileRoute } from "@tanstack/react-router";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { loadDocuments } from "@/lib/os/fns";
import { Empty, Panel, Shell, Status } from "@/components/shell";
import { getRole } from "@/lib/os/roles";

export const Route = createFileRoute("/documents")({ component: DocumentsPage });

function DocumentsPage() {
  const q = useAuthedQuery("documents", () => loadDocuments());
  return (
    <Shell
      title="Documents"
      lede="Originals, extracted text, classification, relationships, evidence. Filenames are not truth."
    >
      {q.data ? (
        <Panel title="Catalog">
          {q.data.documents.length === 0 ? (
            <Empty>No documents yet. Upload from Intake.</Empty>
          ) : (
            <ul className="space-y-3">
              {q.data.documents.map((d) => (
                <li key={String(d.id)} className="rounded-md border border-border p-3 text-sm">
                  <p className="font-medium">{String(d.original_filename)}</p>
                  <p className="text-muted">managed: {String(d.managed_filename)}</p>
                  <p className="mt-1">
                    {String(d.classification)}{" "}
                    {d.routed_role ? `→ ${safeRole(Number(d.routed_role))}` : ""}
                  </p>
                  <p className="mt-1 font-mono text-xs text-subtle">{String(d.checksum_sha256)}</p>
                  <Status value={String(d.review_state)} />
                  <a className="ml-3 text-primary" href={`/api/blob/${d.blob_id}`}>
                    Original
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : (
        <p className="text-muted">Loading documents…</p>
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
