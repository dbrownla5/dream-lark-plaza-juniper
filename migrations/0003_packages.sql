alter table work_packages add column if not exists workflow_id text;
alter table work_packages add column if not exists payload_json text;
create index if not exists work_packages_workflow_idx on work_packages (user_id, workflow_id);
