import { useEffect, useState } from "react";
import { api, when, type Batch, type FileRow } from "../api";
import { Card, Empty, Page, Status } from "../ui";

type Task = { id: string; title: string; status: string; created_at: string };
type Thread = { thread_id: string; role_id: number | null; last_body: string; last_at: string };

/** Where she lands. What needs her, then what's moving, then where she left off. */
export function Today({ go }: { go: (route: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvals, setApprovals] = useState<unknown[]>([]);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    api
      .get<{ tasks: Task[]; approvals: unknown[] }>("/state")
      .then((r) => {
        setTasks(r.tasks);
        setApprovals(r.approvals);
      })
      .catch(() => {});
    api
      .get<{ files: FileRow[]; batches: Batch[] }>("/files")
      .then((r) => {
        setFiles(r.files);
        setBatches(r.batches);
      })
      .catch(() => {});
    api
      .get<{ threads: Thread[] }>("/threads")
      .then((r) => setThreads(r.threads))
      .catch(() => {});
  }, []);

  const needsYou = files.filter((f) => f.status === "review" || f.status === "failed");
  const running = tasks.filter((t) => t.status !== "done");
  const nothing =
    !needsYou.length && !running.length && !approvals.length && !files.length && !threads.length;

  return (
    <Page
      title="Today"
      lede="What's here, what stopped, and where you left off."
    >
      {nothing && (
        <Empty>
          Nothing in here yet. Drop a photo batch on the Photos page, or just start talking on the
          Chat page — both of those stick.
        </Empty>
      )}

      {(approvals.length > 0 || needsYou.length > 0) && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Needs you
          </h2>
          <div className="space-y-3">
            {approvals.length > 0 && (
              <button onClick={() => go("work")} className="block w-full text-left">
                <Card className="border-violet-200 bg-violet-50/60 transition hover:shadow">
                  <p className="text-[15px] font-medium text-stone-900">
                    {approvals.length} {approvals.length === 1 ? "decision" : "decisions"} waiting on
                    you
                  </p>
                  <p className="mt-0.5 text-sm text-stone-600">Nothing moves on these until you say.</p>
                </Card>
              </button>
            )}
            {needsYou.length > 0 && (
              <button onClick={() => go("photos")} className="block w-full text-left">
                <Card className="border-amber-200 bg-amber-50/60 transition hover:shadow">
                  <p className="text-[15px] font-medium text-stone-900">
                    {needsYou.length} {needsYou.length === 1 ? "file" : "files"} the system wouldn't
                    guess on
                  </p>
                  <p className="mt-0.5 text-sm text-stone-600">
                    All saved. It just won't make something up about them.
                  </p>
                </Card>
              </button>
            )}
          </div>
        </section>
      )}

      {running.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Moving
          </h2>
          <div className="space-y-2">
            {running.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <p className="truncate text-[15px] text-stone-800">{t.title}</p>
                <Status value={t.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {batches.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Recent batches
          </h2>
          <div className="space-y-2">
            {batches.slice(0, 4).map((b) => (
              <button
                key={b.id}
                onClick={() => go(b.kind === "document" ? "documents" : "photos")}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-left transition hover:border-stone-400"
              >
                <div className="min-w-0">
                  <p className="truncate text-[15px] text-stone-800">{b.label}</p>
                  <p className="text-sm text-stone-500">
                    {b.file_count} {b.file_count === 1 ? "file" : "files"} · {when(b.created_at)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {threads.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Pick back up
          </h2>
          <div className="space-y-2">
            {threads.slice(0, 5).map((t) => (
              <button
                key={t.thread_id}
                onClick={() => go(t.role_id ? `agent/${t.role_id}` : "chat")}
                className="block w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-left transition hover:border-stone-400"
              >
                <p className="truncate text-[15px] text-stone-800">{t.last_body}</p>
                <p className="mt-0.5 text-sm text-stone-500">{when(t.last_at)}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}
