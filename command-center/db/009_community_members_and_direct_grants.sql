-- Command Center Community Phase 1: voluntary membership + Founder-managed Contributor grants.
-- ADDITIVE migration for approved Command Center PREVIEW Neon branch ONLY.
-- DO NOT apply to public VYREN website databases or unverified branches.
-- Requires Better Auth tables and migration 001; existing members/tasks/roles remain unchanged.
-- Community feature activation is independently gated by CC_COMMUNITY_ENABLED=true.
BEGIN;

CREATE TABLE IF NOT EXISTS cc_community_profiles (
  auth_user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE RESTRICT,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 150),
  wants_to_contribute BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cc_contributor_grants (
  auth_user_id TEXT PRIMARY KEY REFERENCES cc_community_profiles(auth_user_id) ON DELETE RESTRICT,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  granted_by TEXT REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  granted_at TIMESTAMPTZ,
  revoked_by TEXT REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  revoked_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (NOT active OR (granted_by IS NOT NULL AND granted_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS cc_contributor_grants_active_idx
  ON cc_contributor_grants(active, updated_at DESC);

COMMIT;

-- Verification only: SELECT to_regclass('public.cc_community_profiles'),to_regclass('public.cc_contributor_grants');
-- Existing 18-table inventory and backup fingerprints must be captured BEFORE migration.
-- DO NOT run any sample INSERT/UPDATE, grant a person, or touch live identities as a migration test.
