-- VYREN Command Center: CC-PROJECT-LINK-01 (schema-only, additive).
-- Run manually only against the authorized Preview Neon database after a recoverable backup.
-- Requires existing Phase-2 migrations 001, 003 and 004.
-- This is operational project management, NOT VYREN canonical Master/VDCP/FFA/lifecycle authority.
-- No backfill, no old-record reclassification, no production or launch-state mutation.
BEGIN;

CREATE TABLE IF NOT EXISTS cc_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workstream_id UUID REFERENCES cc_workstreams(id) ON DELETE RESTRICT,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
  objective TEXT NOT NULL DEFAULT '' CHECK (char_length(objective) <= 4000),
  next_action TEXT NOT NULL DEFAULT '' CHECK (char_length(next_action) <= 2000),
  status TEXT NOT NULL DEFAULT 'TODO'
    CHECK (status IN ('TODO','IN_PROGRESS','DONE','BLOCKED','DEFERRED')),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  updated_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS cc_projects_workstream_idx
  ON cc_projects(workstream_id, archived_at, updated_at DESC);
CREATE INDEX IF NOT EXISTS cc_projects_active_idx
  ON cc_projects(archived_at, status, updated_at DESC);

-- Actual committed operational project changes only; never synthesize canonical history.
CREATE TABLE IF NOT EXISTS cc_project_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES cc_projects(id) ON DELETE RESTRICT,
  actor_id TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('CREATE','UPDATE','ARCHIVE','RESTORE')),
  revision INTEGER NOT NULL CHECK (revision > 0),
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_project_events_project_idx
  ON cc_project_events(project_id, id DESC);

-- Old standalone tasks/records stay valid: NULL means no project has been assigned.
ALTER TABLE cc_tasks
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES cc_projects(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS cc_tasks_project_idx
  ON cc_tasks(project_id, status)
  WHERE project_id IS NOT NULL;

ALTER TABLE cc_project_records
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES cc_projects(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS cc_project_records_project_idx
  ON cc_project_records(project_id, updated_at DESC)
  WHERE project_id IS NOT NULL;

COMMENT ON TABLE cc_projects IS
  'Founder-managed operational projects. These are not canonical VYREN projects, protocol gates or VDCP work-package acceptance records.';
COMMENT ON COLUMN cc_projects.workstream_id IS
  'Optional managed workstream link; NULL preserves independence from catalogue adoption.';
COMMENT ON COLUMN cc_tasks.project_id IS
  'Optional operational project relationship. Task completion does not imply project completion or VDCP acceptance.';
COMMENT ON COLUMN cc_project_records.project_id IS
  'Optional operational project relationship. Historical standalone records remain untouched.';
COMMENT ON TABLE cc_project_events IS
  'Append-only actual operational project changes; no invented backfill or canonical effect.';

COMMIT;
