import { getBearerToken } from "@/lib/auth/client";
import { useState, type FormEvent } from "react";

export function IntakeForm() {
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    const token = getBearerToken();
    if (!token) return; // native POST + cookie session
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const res = await fetch("/api/intake", {
        method: "POST",
        body: fd,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; photos?: { batchId: string } };
      if (!res.ok) {
        setNotice(json.error || `Intake failed (${res.status})`);
        return;
      }
      setNotice("Kept. Your words are sealed. Files, if any, are preserved on the server.");
      form.reset();
      if (json.photos?.batchId) window.location.assign("/media");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Intake failed");
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
        Originals are written once, checksummed, and kept. Drag-and-drop is one intake path — the same
        pipeline accepts the API.
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
        <p className="text-xs text-muted">Native form POST — does not depend on a scripted button.</p>
      </div>
      {notice ? <p className="mt-3 text-sm text-review">{notice}</p> : null}
    </form>
  );
}
