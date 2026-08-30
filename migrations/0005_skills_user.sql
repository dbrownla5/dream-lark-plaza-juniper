-- Scope skills per user. The table previously had no user_id, so any user's
-- qualification run mutated every user's rows (cross-tenant leak). Rows are
-- reseeded per user by ensureWorkspace, so legacy global rows are dropped.

alter table skills add column if not exists user_id text;

alter table skills drop constraint if exists skills_role_id_name_key;

delete from skills where user_id is null;

create unique index if not exists skills_user_role_name_key on skills (user_id, role_id, name);
