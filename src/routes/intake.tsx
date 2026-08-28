import { createFileRoute, Link } from "@tanstack/react-router";
import { IntakeForm } from "@/components/intake-form";
import { Empty, Panel, Shell, Status } from "@/components/shell";
import { useAuthedQuery } from "@/hooks/use-authed-query";
import { loadDocuments, loadMedia } from "@/lib/os/fns";

export const Route = createFileRoute("/intake")({ component: IntakePage });

function IntakePage() {
  const docs = useAuthedQuery("documents", () => loadDocuments());
  const media = useAuthedQuery("media", () => loadMedia());
  return (
    <Shell
      title="Bring in"
      lede="Words are sealed. Files are checksummed into originals. The same event starts the occupational path."
    >
      <IntakeForm />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Panel
          title="Documents in the catalog"
          action={
            <Link to="/documents" className="text-sm text-primary">
              All
            </Link>
          }
        >
          {!docs.data || docs.data.documents.length === 0 ? (
            <Empty>No documents held yet.</Empty>
          ) : (
            <ul className="space-y-2 text-sm">
              {docs.data.documents.slice(0, 8).map((d) => (
                <li key={String(d.id)}>
                  {String(d.original_filename)} · {String(d.classification)}{" "}
                  <Status value={String(d.review_state)} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel
          title="Photo batches"
          action={
            <Link to="/media" className="text-sm text-primary">
              Catalog
            </Link>
          }
        >
          {!media.data || media.data.batches.length === 0 ? (
            <Empty>No photo batches held yet.</Empty>
          ) : (
            <ul className="space-y-2 text-sm">
              {media.data.batches.slice(0, 8).map((b) => (
                <li key={String(b.id)}>
                  {String(b.item_count)} files · {String(b.source_type)} <Status value={String(b.status)} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </Shell>
  );
}
