-- VYREN Command Center /secure - operational opportunities and outreach only.
-- Run manually on approved Preview Neon neondb AFTER reviewing a recoverable backup.
-- Additive: no update, deletion, or backfill of existing VYREN records.
-- Stage labels are observations, NOT contracts, approvals, CEX listing or funds.
BEGIN;
CREATE TABLE IF NOT EXISTS cc_opportunities (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 title TEXT NOT NULL CHECK(char_length(title) BETWEEN 2 AND 200),
 organization TEXT NOT NULL DEFAULT '' CHECK(char_length(organization)<=200),
 category TEXT NOT NULL DEFAULT 'PARTNERSHIP'
  CHECK(category IN ('PARTNERSHIP','PROVIDER','FUNDING','EXCHANGE','OTHER')),
 stage TEXT NOT NULL DEFAULT 'RESEARCH'
  CHECK(stage IN ('RESEARCH','QUALIFIED','CONTACTED','REPLY_RECEIVED','DISCUSSION',
    'PROPOSAL','INTERNAL_REVIEW','WAITING_EXTERNAL','DORMANT','CLOSED')),
 summary TEXT NOT NULL DEFAULT '' CHECK(char_length(summary)<=4000),
 next_action TEXT NOT NULL DEFAULT '' CHECK(char_length(next_action)<=2000),
 evidence_url TEXT CHECK(evidence_url IS NULL OR char_length(evidence_url)<=2000),
 revision INTEGER NOT NULL DEFAULT 1 CHECK(revision>0),
 created_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
 updated_by TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
 archived_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_opportunities_stage_idx
 ON cc_opportunities(archived_at,stage,updated_at DESC);

CREATE TABLE IF NOT EXISTS cc_opportunity_events (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 opportunity_id UUID NOT NULL REFERENCES cc_opportunities(id) ON DELETE RESTRICT,
 actor_id TEXT NOT NULL REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
 action TEXT NOT NULL CHECK(action IN ('CREATE','UPDATE','ARCHIVE','RESTORE')),
 revision INTEGER NOT NULL CHECK(revision>0),
 snapshot JSONB NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cc_opportunity_events_opportunity_idx
 ON cc_opportunity_events(opportunity_id,id DESC);
COMMENT ON TABLE cc_opportunities IS
 'Founder-only operational opportunity/outreach tracking. CLOSED is only an operational label, never legal commitment, payment or listing confirmation.';
COMMENT ON TABLE cc_opportunity_events IS
 'Real transactional events only; preserves history through archive/restore. Not canonical VYREN legal, economics, lifecycle or governance authority.';
COMMIT;
