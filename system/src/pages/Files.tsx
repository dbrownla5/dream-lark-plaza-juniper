import { useCallback, useEffect, useRef, useState } from "react";
import { api, humanSize, when, type Batch, type FileRow } from "../api";
import { Button, Empty, Note, Page, Status } from "../ui";

type Storage = { backend: string; buckets: string[]; reachable: boolean };

/**
 * Photos and Documents are the same page with different words, because they
 * are the same promise: what you put in is kept, you can see it, and you can
 * tell it when it's wrong.
 */
export function Files({ surface }: { surface: "photos" | "documents" }) {
  const photos = surface === "photos";
  const [files, setFiles] = useState<FileRow[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [storage, setStorage] = useState<Storage | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await api.get<{ files: FileRow[]; batches: Batch[]; storage: Storage }>(
      `/files?kind=${photos ? "image" : "document"}`,
    );
    setFiles(r.files);
    setBatches(r.batches.filter((b) => b.kind === (photos ? "photo" : "document")));
    setStorage(r.storage);
  }, [photos]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  const send = useCallback(
    async (list: FileList | File[]) => {
      const chosen = Array.from(list);
      if (!chosen.length) return;
      setError(null);
      setBusy(`Saving ${chosen.length} ${chosen.length === 1 ? "file" : "files"}…`);
      try {
        const form = new FormData();
        form.append("surface", surface);
        for (const f of chosen) form.append("files", f);
        await api.upload<{ batchId: string }>("/upload", form);
        setBusy(null);
        await load();
      } catch (e) {
        setBusy(null);
        setError(e instanceof Error ? e.message : "The upload failed. Nothing was saved.");
      }
    },
    [load, surface],
  );

  const needsYou = files.filter((f) => f.status === "review" || f.status === "failed");

  return (
    <Page
      title={photos ? "Photos" : "Documents"}
      lede={
        photos
          ? "Drop a batch in. Originals are saved exactly as they came and never renamed. Nothing is done to them beyond that yet — the photo job gets built out with you before anything starts touching them."
          : "Drop documents in. The original is kept exactly as it came, and everything derived from it points back to it."
      }
      action={
        <Button onClick={() => input.current?.click()}>
          Add {photos ? "photos" : "documents"}
        </Button>
      }
    >
      <input
        ref={input}
        type="file"
        multiple
        accept={photos ? "image/*" : undefined}
        className="hidden"
        onChange={(e) => e.target.files && send(e.target.files)}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          send(e.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        className={`mb-6 cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging ? "border-stone-900 bg-white" : "border-stone-300 bg-white/60 hover:bg-white"
        }`}
      >
        <p className="text-[15px] font-medium text-stone-700">
          {busy ?? `Drop ${photos ? "photos" : "documents"} here`}
        </p>
        <p className="mt-1 text-sm text-stone-500">
          {busy ? "Don't clear your phone or card until this says saved." : "or tap to choose"}
        </p>
      </div>

      {error && <Note tone="bad">{error}</Note>}

      {storage && (
        <p className="mb-8 text-sm text-stone-500">
          {storage.backend === "object_store" && storage.reachable
            ? `Originals are going to remote storage (${storage.buckets.length} containers).`
            : storage.backend === "object_store"
              ? "Remote storage is configured but not answering right now — originals are being kept in the database instead, and nothing is being dropped."
              : "Originals are being kept in the database. Remote storage isn't configured yet."}
        </p>
      )}

      {needsYou.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Needs you ({needsYou.length})
          </h2>
          <div className="space-y-3">
            {needsYou.map((f) => (
              <div key={f.id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[15px] font-medium text-stone-900">{f.original_name}</p>
                  <Status value={f.status} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
                  {f.failure_reason ?? f.uncertainty}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {batches.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Batches
          </h2>
          <div className="space-y-2">
            {batches.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-[15px] font-medium text-stone-900">{b.label}</p>
                  <p className="text-sm text-stone-500">
                    {b.file_count} {b.file_count === 1 ? "file" : "files"}
                    {b.review_count > 0 && ` · ${b.review_count} need you`}
                    {b.failed_count > 0 && ` · ${b.failed_count} failed`} · {when(b.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {batches.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Batches
          </h2>
          <div className="space-y-2">
            {batches.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-[15px] font-medium text-stone-900">{b.label}</p>
                  <p className="text-sm text-stone-500">
                    {b.file_count} {b.file_count === 1 ? "file" : "files"}
                    {b.review_count > 0 && ` · ${b.review_count} need you`}
                    {b.failed_count > 0 && ` · ${b.failed_count} failed`} · {when(b.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
        Everything here
      </h2>

      {files.length === 0 ? (
        <Empty>Nothing yet. What you drop in stays here.</Empty>
      ) : photos ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((f) => (
            <figure key={f.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              <img
                src={`/api/files/${f.id}/bytes`}
                alt={f.original_name}
                loading="lazy"
                className="aspect-square w-full bg-stone-100 object-cover"
              />
              <figcaption className="space-y-1.5 p-3">
                <p className="truncate text-sm font-medium text-stone-900" title={f.original_name}>
                  {f.original_name}
                </p>
                {f.working_name && (
                  <p className="truncate text-xs text-stone-500" title={f.working_name}>
                    filed as {f.working_name}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <Status value={f.status} />
                  <span className="text-xs text-stone-400">{humanSize(f.byte_size)}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-stone-900">{f.original_name}</p>
                <p className="text-sm text-stone-500">
                  {humanSize(f.byte_size)} · {when(f.created_at)}
                </p>
              </div>
              <Status value={f.status} />
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
