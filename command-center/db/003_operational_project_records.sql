-- VYREN Command Center /secure - operational project records, not canonical decisions.
-- APPLY MANUALLY TO AUTHORIZED PREVIEW NEON ONLY after reviewing and backing up.
-- No production migration or automatic backfill of VYREN Master/GNR/FFA/lifecycle state.
BEGIN;

CREATE TABLE IF NOT EXISTS cc_project_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workstream TEXT NOT NULL DEFAULT 'Command Center'
    CHECK (char_length(workstream) BETWEEN 2 AND 120),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
  summary TEXT NOT NULL DEFAULT '' CHECK (char_length(summary) <= 4000),
  status TEXT NOT NULL DEFAULT 'TODO'
    CHECK (status IN ('TODO','IN_PROGRESS','DONE','BLOCKED','DEFERRED')),
  next_action TEXT NOT NULL DEFAULT '' CHECK (char_length(next_action) <= 2000),
  evidence_url TEXT CHECK (evidence_url IS NULL OR char_length(evidence_url) <= 2000),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  updated_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS cc_project_records_active_idx
 ON cc_project_records(archived_at,updated_at DESC);

-- Event entries are actual write records, never synthetic/historical audit claims.
-- Snapshots are read only by the explicitly Founder-authorized records API.
CREATE TABLE IF NOT EXISTS cc_project_record_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES cc_project_records(id) ON DELETE RESTRICT,
  actor_id TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('CREATE','UPDATE','ARCHIVE','RESTORE')),
  revision INTEGER NOT NULL CHECK (revision > 0),
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_project_record_events_record_idx
 ON cc_project_record_events(record_id,id DESC);

COMMENT ON TABLE cc_project_records IS
 'Operational Command Center status register, never an authority over canonical VYREN decisions or lifecycle gates.';
COMMENT ON TABLE cc_project_record_events IS
 'Append-only application-level event snapshots for real operational record edits; never backfill synthetic historic actions.';

COMMIT;
