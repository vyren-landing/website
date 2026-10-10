-- VYREN Command Center Phase 2: Google Contributor invitation registry
-- Apply only to the existing PREVIEW Neon PostgreSQL database.
-- Non-destructive: no changes to existing task, member, deliverable, review, or audit rows.
BEGIN;
CREATE TABLE IF NOT EXISTS cc_team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (
    email = lower(btrim(email))
    AND char_length(email) BETWEEN 5 AND 254
  ),
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'ACTIVE', 'REVOKED')),
  google_account_id TEXT UNIQUE,
  member_id TEXT UNIQUE REFERENCES "user"(id) ON DELETE RESTRICT,
  created_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (status = 'PENDING' AND google_account_id IS NULL AND member_id IS NULL)
    OR (status IN ('ACTIVE', 'REVOKED')
      AND ((google_account_id IS NULL AND member_id IS NULL)
        OR (google_account_id IS NOT NULL AND member_id IS NOT NULL)))
  )
);
CREATE INDEX IF NOT EXISTS cc_team_invites_status_idx
  ON cc_team_invites(status, created_at DESC);
COMMIT;