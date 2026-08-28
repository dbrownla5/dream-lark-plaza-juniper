-- Dayna MCP/LLM OS — authoritative catalog (packet TAB 03 §3.2–3.7)
-- No extensions. Application-level hashing. Originals are write-once in app code.

create table if not exists workspaces (
  id text primary key,
  user_id text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id text primary key,
  user_id text not null,
  name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists matters (
  id text primary key,
  user_id text not null,
  client_id text,
  title text not null,
  kind text not null default 'general',
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  user_id text not null,
  matter_id text,
  title text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- Living context: user words vs inference never mix in one row
create table if not exists living_context (
  id text primary key,
  user_id text not null,
  kind text not null,
  -- user_statement | verified_fact | external_evidence | agent_inference
  -- | calculation | preference | decision | temporary_idea | correction
  -- | superseded_state | unfinished_work | processing_aloud
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
create index if not exists living_context_lineage_idx on living_context (lineage_id, version_n);

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
  origin text not null, -- user | agent_inference
  created_at timestamptz not null default now()
);

-- Object store (zone prefixes = storage containers)
create table if not exists object_blobs (
  id text primary key,
  user_id text not null,
  zone text not null,
  -- originals | intake | temp | derivatives | review | agent_ready | outputs | catalog | archive
  object_key text not null,
  checksum_sha256 text not null,
  mime text,
  byte_size integer not null,
  bytes bytea not null,
  original_filename text,
  immutable integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, object_key)
);
create index if not exists object_blobs_zone_idx on object_blobs (user_id, zone);

create table if not exists media_batches (
  id text primary key,
  user_id text not null,
  source_type text not null,
  status text not null default 'intake',
  project_id text,
  matter_id text,
  client_id text,
  purpose text,
  item_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists media_assets (
  id text primary key,
  user_id text not null,
  batch_id text not null,
  blob_id text not null,
  original_filename text not null,
  managed_filename text,
  checksum_sha256 text not null,
  mime text,
  width integer,
  height integer,
  metadata_json text,
  metadata_trust text not null default 'untrusted',
  analysis_json text,
  analysis_model text,
  analysis_confidence real,
  purpose_candidate text,
  purpose_confidence real,
  quality_flag text,
  duplicate_group text,
  project_id text,
  matter_id text,
  client_id text,
  item_id text,
  owner_role integer,
  review_state text not null default 'none',
  workflow_state text not null default 'preserved',
  is_test_only integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists media_assets_batch_idx on media_assets (batch_id);

create table if not exists media_derivatives (
  id text primary key,
  user_id text not null,
  original_asset_id text not null,
  blob_id text not null,
  purpose text not null,
  lineage_note text,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id text primary key,
  user_id text not null,
  blob_id text not null,
  original_filename text not null,
  managed_filename text,
  checksum_sha256 text not null,
  mime text,
  classification text,
  classification_confidence real,
  extracted_text text,
  project_id text,
  matter_id text,
  client_id text,
  routed_role integer,
  review_state text not null default 'none',
  is_test_only integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists resale_items (
  id text primary key,
  user_id text not null,
  batch_id text,
  client_id text,
  matter_id text,
  title text,
  status text not null default 'intake',
  identification_json text,
  condition_json text,
  comps_json text,
  pricing_json text,
  listing_json text,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id text primary key,
  user_id text not null,
  role_id integer not null,
  project_id text,
  matter_id text,
  title text not null,
  request_statement text not null,
  interpretation text,
  status text not null default 'queued',
  -- queued | running | waiting_approval | handed_off | blocked | failed | done
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
create index if not exists tasks_user_status_idx on tasks (user_id, status, created_at desc);

create table if not exists work_packages (
  id text primary key,
  user_id text not null,
  title text not null,
  objective text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists workflow_instances (
  id text primary key,
  user_id text not null,
  chain_id text not null,
  status text not null default 'running',
  current_step integer not null default 0,
  subject_id text,
  subject_kind text,
  created_at timestamptz not null default now()
);

create table if not exists task_events (
  id text primary key,
  task_id text not null,
  user_id text not null,
  kind text not null,
  body text,
  created_at timestamptz not null default now()
);

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

create table if not exists approvals (
  id text primary key,
  user_id text not null,
  task_id text,
  action_kind text not null,
  consequence text not null,
  status text not null default 'pending',
  decided_at timestamptz,
  decided_note text,
  created_at timestamptz not null default now()
);

create table if not exists skills (
  id text primary key,
  role_id integer not null,
  name text not null,
  status text not null default 'candidate',
  -- candidate | qualified | blocked
  evidence text,
  unique (role_id, name)
);

create table if not exists recovery_points (
  id text primary key,
  task_id text not null,
  user_id text not null,
  snapshot_json text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id text primary key,
  user_id text not null,
  actor text not null,
  action text not null,
  target text,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists usage_events (
  id text primary key,
  user_id text not null,
  kind text not null,
  cost_cents real not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists spend_limits (
  user_id text primary key,
  daily_cents real not null default 500,
  updated_at timestamptz not null default now()
);

create table if not exists system_health (
  id text primary key default 'local',
  user_id text not null,
  payload_json text not null,
  updated_at timestamptz not null default now()
);

create table if not exists mcp_tokens (
  id text primary key,
  user_id text not null,
  token_hash text not null,
  label text,
  created_at timestamptz not null default now()
);
