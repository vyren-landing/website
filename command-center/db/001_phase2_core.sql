-- VYREN Command Center - Phase 2 operational workspace only.
-- Must run manually after database linkage and environment verification.
-- Better Auth tables (user, session, account, verification) must be created
-- first using the version-matched Better Auth migration tool.
BEGIN;
CREATE TABLE IF NOT EXISTS cc_members (
  auth_user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('Founder','Contributor')),
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cc_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
  objective TEXT NOT NULL CHECK (char_length(objective) BETWEEN 3 AND 4000),
  expected_output TEXT NOT NULL DEFAULT '',
  owner_id TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  created_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'BRIEFED'
    CHECK(status IN ('BRIEFED','ACCEPTED','IN PROGRESS','FOUNDER REVIEW','COMPLETED','CANCELLED')),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_tasks_owner_idx ON cc_tasks(owner_id,status);
CREATE TABLE IF NOT EXISTS cc_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES cc_tasks(id) ON DELETE RESTRICT,
  submitted_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  body TEXT NOT NULL CHECK(char_length(btrim(body)) BETWEEN 30 AND 10000),
  evidence_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_deliverables_task_idx ON cc_deliverables(task_id,created_at);
CREATE TABLE IF NOT EXISTS cc_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES cc_tasks(id) ON DELETE RESTRICT,
  reviewed_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  decision TEXT NOT NULL CHECK(decision IN ('APPROVE','REVISION')),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cc_audit (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_audit_created_idx ON cc_audit(created_at DESC);
COMMIT;
