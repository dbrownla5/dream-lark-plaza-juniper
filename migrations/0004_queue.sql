create table if not exists intake_jobs (
  id text primary key,
  user_id text not null,
  kind text not null,
  status text not null default 'queued',
  payload_json text not null,
  error text,
  result_json text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists intake_jobs_user_status_idx on intake_jobs (user_id, status, created_at);
