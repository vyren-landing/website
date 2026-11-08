-- VYREN Community discussion engine, additive draft migration 010.
-- Scope: dedicated isolated Neon QA branch FIRST; NO main/production application.
-- Public records are only visible if separately APPROVED; TEAM records never enter public feed.
-- This migration creates no sample people, posts, comments, or public registration.
BEGIN;

CREATE TABLE IF NOT EXISTS cc_community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  topic TEXT NOT NULL CHECK (topic IN ('GENERAL','TECHNOLOGY','CRYPTO','VYREN_QA','IDEAS')),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 4 AND 140),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  visibility TEXT NOT NULL CHECK (visibility IN ('PUBLIC','TEAM')),
  moderation_status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (moderation_status IN ('PENDING','APPROVED','HIDDEN')),
  reviewed_by TEXT REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (moderation_status <> 'APPROVED' OR (reviewed_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS cc_community_posts_public_idx
 ON cc_community_posts(approved_at DESC, id DESC)
 WHERE visibility='PUBLIC' AND moderation_status='APPROVED';

CREATE INDEX IF NOT EXISTS cc_community_posts_author_idx
 ON cc_community_posts(author_user_id,created_at DESC);

CREATE TABLE IF NOT EXISTS cc_community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES cc_community_posts(id) ON DELETE RESTRICT,
  author_user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  moderation_status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (moderation_status IN ('PENDING','APPROVED','HIDDEN')),
  reviewed_by TEXT REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (moderation_status <> 'APPROVED' OR (reviewed_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS cc_community_comments_post_public_idx
 ON cc_community_comments(post_id,approved_at DESC,id DESC)
 WHERE moderation_status='APPROVED';

CREATE TABLE IF NOT EXISTS cc_community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  target_type TEXT NOT NULL CHECK (target_type IN ('POST','COMMENT')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (char_length(reason) BETWEEN 10 AND 500),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','REVIEWED','CLOSED')),
  reviewed_by TEXT REFERENCES cc_members(auth_user_id) ON DELETE RESTRICT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (status='OPEN' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS cc_community_reports_queue_idx
 ON cc_community_reports(status,created_at DESC);

COMMIT;

-- Implementation notes:
-- 1. Application must validate that target_id exists in correct table and is visible
--    to reporter; polymorphic report target is not a database FK.
-- 2. Never expose "TEAM" posts/comments/reports in anonymous endpoints.
-- 3. No direct UPDATE/INSERT user-facing routes in this batch. Owner/moderation,
--    rate-limit, privacy, anti-abuse and recovery gates precede write enablement.
