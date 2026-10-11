-- VYREN Command Center: optional organizational position metadata.
-- PREVIEW ONLY. Backup before applying. No privilege, auth role or canonical effect.
-- Requires 001 Phase-2 cc_members + tasks. No backfill of existing members or tasks.
BEGIN;

ALTER TABLE cc_members
 ADD COLUMN IF NOT EXISTS position_title TEXT;

DO $$
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint
   WHERE conrelid='public.cc_members'::regclass
     AND conname='cc_members_position_title_size'
 ) THEN
   ALTER TABLE cc_members ADD CONSTRAINT cc_members_position_title_size
     CHECK (position_title IS NULL OR char_length(position_title) BETWEEN 2 AND 120);
 END IF;
END $$;

CREATE INDEX IF NOT EXISTS cc_tasks_owner_active_update_idx
 ON cc_tasks(owner_id, updated_at DESC)
 WHERE archived_at IS NULL;

COMMENT ON COLUMN cc_members.position_title IS
 'Optional human-readable operational position. Not a permission or Founder/Contributor role. Never confers governance, VDCP, FFA, treasury, or launch authority.';

COMMIT;
