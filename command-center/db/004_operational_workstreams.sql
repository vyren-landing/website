-- VYREN Command Center /secure - independent OPERATIONAL workstream catalogue.
-- PREVIEW NEON ONLY: review, snapshot/backup, then apply manually. Never auto-run.
-- Additive migration: does not change cc_project_records or historic events.
-- This is NOT canonical VYREN Master, VDCP, FFA or lifecycle state.
BEGIN;

CREATE TABLE IF NOT EXISTS cc_workstreams (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 source_key TEXT NOT NULL UNIQUE
  CHECK (char_length(source_key) BETWEEN 2 AND 120),
 display_name TEXT NOT NULL
  CHECK (char_length(display_name) BETWEEN 2 AND 120),
 summary TEXT NOT NULL DEFAULT ''
  CHECK (char_length(summary) <= 4000),
 next_action TEXT NOT NULL DEFAULT ''
  CHECK (char_length(next_action) <= 2000),
 state TEXT NOT NULL DEFAULT 'ACTIVE'
  CHECK (state IN ('ACTIVE','PAUSED','ARCHIVED')),
 revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
 created_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
 updated_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_workstreams_state_idx
 ON cc_workstreams(state,updated_at DESC);

CREATE TABLE IF NOT EXISTS cc_workstream_events (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 workstream_id UUID NOT NULL REFERENCES cc_workstreams(id) ON DELETE RESTRICT,
 actor_id TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
 action TEXT NOT NULL
  CHECK (action IN ('CREATE','ADOPT','UPDATE','ARCHIVE','RESTORE')),
 revision INTEGER NOT NULL CHECK (revision > 0),
 snapshot JSONB NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_workstream_events_stream_idx
 ON cc_workstream_events(workstream_id,id DESC);
COMMENT ON TABLE cc_workstreams IS
 'Independent operational workstream metadata, source_key is stable; renaming does not modify related historic project records.';
COMMENT ON TABLE cc_workstream_events IS
 'Actual committed revisions only; no synthetic backfill. Neither these events nor this catalogue amend canonical VYREN decisions.';

COMMIT;
