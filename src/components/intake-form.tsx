import { getBearerToken } from "@/lib/auth/client";
import { useState, type FormEvent } from "react";

type IntakeJson = {
  ok?: boolean;
  error?: string;
  words?: {
    listened?: boolean;
    taskId?: string;
    status?: string;
    blockedReason?: string | null;
    interpretation?: string | null;
    output?: string | null;
  };
  photos?: { batchId?: string; originalsPreserved?: boolean; assets?: unknown[] };
  documents?: { original_filename?: string; checksum_sha256?: string }[];
};

export function IntakeForm() {
  const [notice, setNotice] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    setOutput(null);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getBearerToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/intake", { method: "POST", body: fd, headers });
      const json = (await res.json()) as IntakeJson;
      if (!res.ok || json.ok === false) {
        setNotice(json.error || `Bring-in failed (${res.status})`);
        return;
      }
      const bits: string[] = [];
      if (json.words?.listened) bits.push("Your words are sealed. No occupation was started.");
      if (json.words?.taskId) {
        bits.push(`Occupation ${json.words.status ?? "ran"}.`);
        if (json.words.blockedReason) bits.push(json.words.blockedReason);
        if (json.words.interpretation) setOutput(json.words.interpretation);
        else if (json.words.output) setOutput(json.words.output);
      }
      if (json.photos?.batchId) {
        bits.push(
          `Photos preserved${json.photos.originalsPreserved ? ", originals write-once" : ""}.`,
        );
      }
      if (json.documents?.length) {
        const first = json.documents[0];
        bits.push(
          `${json.documents.length} document(s) preserved on the server. Occupations queued.`,
        );
      }
      setNotice(bits.join(" ") || "Kept.");
      form.reset();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Bring-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      method="POST"
      action="/api/intake"
      encType="multipart/form-data"
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-surface p-5"
    >
      <input type="hidden" name="source_type" value="web_app" />
      <label className="block text-sm font-medium text-fg" htmlFor="words">
        What are you working through
      </label>
      <p className="mt-1 text-sm text-muted">
        Speak as you think. This is kept as your words. It does not start a job. To have an
        occupation work it, open Occupations and put it on that desk.
      </p>
      <textarea
        id="words"
        name="words"
        rows={7}
        className="mt-3 w-full rounded-md border border-border bg-bg px-3 py-3 text-base text-fg"
        placeholder="Unfinished thought, correction, or the work you want done…"
      />
      <label className="mt-5 block text-sm font-medium text-fg" htmlFor="files">
        Files and photos
      </label>
      <p className="mt-1 text-sm text-muted">
        Originals are written once, checksummed, and kept.
      </p>
      <input
        id="files"
        name="files"
        type="file"
        multiple
        className="mt-3 block w-full text-sm text-fg file:mr-3 file:rounded-md file:border file:border-border file:bg-bg file:px-3 file:py-2"
      />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg disabled:opacity-60"
        >
          {busy ? "Preserving…" : "Bring in"}
        </button>
      </div>
      {notice ? <p className="mt-3 text-sm text-ok">{notice}</p> : null}
      {output ? (
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-bg p-3 text-sm">
          {output}
        </pre>
      ) : null}
    </form>
  );
}
