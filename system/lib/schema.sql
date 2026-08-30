-- Idempotent schema: safe to run on every boot.

create table if not exists tasks (
  id text primary key,
  user_id text not null,
  role_id integer not null,
  project_id text,
  title text not null,
  request_statement text not null,
  interpretation text,
  status text not null default 'queued',
  -- queued | running | waiting_approval | handed_off | blocked | done
  workflow_id text,
  step_name text,
  parent_task_id text,
  package_id text,
  input_json text,
  output_json text,
  evidence_json text,
  uncertainty text,
  recovery_json text,
  is_test_only integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_user_idx on tasks (user_id, created_at desc);
create index if not exists tasks_wf_idx on tasks (user_id, workflow_id, role_id, step_name);

create table if not exists task_events (
  id text primary key,
  task_id text not null,
  user_id text not null,
  kind text not null,
  body text,
  created_at timestamptz not null default now()
);
create index if not exists task_events_user_idx on task_events (user_id, created_at desc);

create table if not exists agent_runs (
  id text primary key,
  task_id text not null,
  user_id text not null,
  role_id integer not null,
  cycle_step text not null,
  provider text,
  model text,
  prompt_tokens integer,
  completion_tokens integer,
  cost_cents real,
  blocked_reason text,
  rubric_json text,
  created_at timestamptz not null default now()
);
create index if not exists agent_runs_user_idx on agent_runs (user_id, created_at desc);

create table if not exists recovery_points (
  id text primary key,
  task_id text not null,
  user_id text not null,
  snapshot_json text not null,
  created_at timestamptz not null default now()
);

create table if not exists workflow_instances (
  id text primary key,
  user_id text not null,
  chain_id text not null,
  status text not null default 'running',
  -- running | blocked | completed
  current_step integer not null default 0,
  subject_id text,
  subject_kind text,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id text primary key,
  user_id text not null,
  task_id text,
  action_kind text not null,
  consequence text,
  status text not null default 'pending',
  decided_at timestamptz,
  decided_note text,
  created_at timestamptz not null default now()
);

create table if not exists living_context (
  id text primary key,
  user_id text not null,
  kind text not null,
  body text not null,
  author text not null,
  source text,
  confidence real,
  scope text,
  permissions text,
  project_id text,
  matter_id text,
  supersedes_id text,
  superseded_by text,
  lineage_id text not null,
  version_n integer not null default 1,
  artifact_id text,
  created_at timestamptz not null default now(),
  check (kind in (
    'user_statement','verified_fact','external_evidence','agent_inference',
    'calculation','preference','decision','temporary_idea','correction',
    'superseded_state','unfinished_work','processing_aloud'
  ))
);
create index if not exists living_context_user_idx on living_context (user_id, created_at desc);

create table if not exists artifacts (
  id text primary key,
  user_id text not null,
  title text not null,
  kind text not null,
  lineage_id text not null,
  current_version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists artifact_versions (
  id text primary key,
  artifact_id text not null,
  user_id text not null,
  version_n integer not null,
  body text not null,
  origin text not null,
  created_at timestamptz not null default now()
);

create table if not exists skills (
  id text primary key,
  user_id text not null,
  role_id integer not null,
  name text not null,
  status text not null default 'candidate',
  evidence text
);
create unique index if not exists skills_user_role_name_key on skills (user_id, role_id, name);

create table if not exists spend_limits (
  user_id text primary key,
  daily_cents integer not null default 500
);

create table if not exists usage_events (
  id text primary key,
  user_id text not null,
  kind text not null,
  cost_cents real not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists usage_events_user_idx on usage_events (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Files. Everything below exists so that when Dayna drops something in, it is
-- preserved before anything else happens to it, and stays traceable to what it
-- came from. Originals are never mutated; derivatives point back.
-- ---------------------------------------------------------------------------

-- Durable bytes when no object store is configured. The object store is
-- preferred (STORAGE_BUCKET_PREFIX); this table is the fallback so that
-- "preserved" is never a promise the system cannot keep.
create table if not exists file_blobs (
  id text primary key,
  user_id text not null,
  bytes bytea not null,
  byte_size integer not null,
  mime text,
  created_at timestamptz not null default now()
);

create table if not exists batches (
  id text primary key,
  user_id text not null,
  label text not null,
  kind text not null default 'photo', -- photo | document | mixed
  note text,
  workflow_id text,
  created_at timestamptz not null default now()
);
create index if not exists batches_user_idx on batches (user_id, created_at desc);

-- One row per file Dayna put in, image or document. `zone` is where the
-- authoritative original lives; `uri` resolves through lib/storage.ts.
create table if not exists files (
  id text primary key,
  user_id text not null,
  batch_id text,
  kind text not null,                    -- image | document | other
  original_name text not null,
  mime text not null,
  byte_size integer not null,
  checksum_sha256 text not null,
  zone text not null default 'originals',
  uri text not null,
  working_name text,                     -- content-informed name; original_name never changes
  status text not null default 'preserved',
  -- preserved | analyzing | cataloged | review | failed
  analysis_json text,
  extracted_text text,
  uncertainty text,
  failure_reason text,
  item_id text,
  task_id text,
  workflow_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists files_user_idx on files (user_id, created_at desc);
create index if not exists files_batch_idx on files (user_id, batch_id);
create index if not exists files_checksum_idx on files (user_id, checksum_sha256);

-- Non-destructive derivatives always name their parent.
create table if not exists derivatives (
  id text primary key,
  user_id text not null,
  file_id text not null,
  purpose text not null,                 -- thumbnail | listing | working_copy | export
  zone text not null default 'derivatives',
  uri text not null,
  mime text,
  byte_size integer,
  created_at timestamptz not null default now()
);
create index if not exists derivatives_file_idx on derivatives (user_id, file_id);

-- Chat that survives the page. thread_id is 'general' for the ordinary
-- assistant, or 'role:<n>' for one occupation's own chat.
create table if not exists chat_messages (
  id text primary key,
  user_id text not null,
  thread_id text not null,
  role_id integer,
  author text not null,                  -- dayna | agent | system
  body text not null,
  blocked_reason text,
  context_id text,
  created_at timestamptz not null default now()
);
create index if not exists chat_thread_idx on chat_messages (user_id, thread_id, created_at);
