async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, init);
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { error: text.slice(0, 400) };
  }
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json as T;
}

export const api = {
  get: <T,>(p: string) => req<T>(p),
  post: <T,>(p: string, body?: unknown) =>
    req<T>(p, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    }),
  upload: <T,>(p: string, form: FormData) => req<T>(p, { method: "POST", body: form }),
};

export type Agent = {
  id: number;
  name: string;
  family: string;
  job: string;
  inScope: string;
  outOfScope: string;
  threadId: string;
};

export type Message = {
  id: string;
  thread_id: string;
  role_id: number | null;
  author: string;
  body: string;
  blocked_reason: string | null;
  created_at: string;
};

export type FileRow = {
  id: string;
  batch_id: string | null;
  kind: string;
  original_name: string;
  working_name: string | null;
  mime: string;
  byte_size: number;
  checksum_sha256: string;
  uri: string;
  status: string;
  analysis_json: string | null;
  extracted_text: string | null;
  uncertainty: string | null;
  failure_reason: string | null;
  created_at: string;
};

export type Batch = {
  id: string;
  label: string;
  kind: string;
  file_count: number;
  review_count: number;
  failed_count: number;
  workflow_id: string | null;
  created_at: string;
};

export type LivingRecord = {
  id: string;
  kind: string;
  body: string;
  author: string;
  source: string | null;
  superseded_by: string | null;
  created_at: string;
};

export function humanSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function when(iso: string): string {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} hr ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
