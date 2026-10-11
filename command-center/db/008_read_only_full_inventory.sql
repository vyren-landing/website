-- VYREN Command Center — full-table inventory (read-only)
-- Source: Phase 2 001..007 plus Better Auth (user, session, account, verification).
-- Run in Neon SQL Editor on ONE explicitly selected branch at a time.
-- Branch name is NOT returned by PostgreSQL: record the Neon branch selector manually.
-- Do not use this query as a backup. Counts may change when users sign in.
-- No rows, user identities, emails or credentials are returned.

-- A. Required schema exists: 18 expected public tables.
WITH required(table_name) AS (
 VALUES
  ('user'),('session'),('account'),('verification'),
  ('cc_members'),('cc_tasks'),('cc_deliverables'),('cc_reviews'),('cc_audit'),
  ('cc_team_invites'),('cc_project_records'),('cc_project_record_events'),
  ('cc_workstreams'),('cc_workstream_events'),
  ('cc_opportunities'),('cc_opportunity_events'),
  ('cc_projects'),('cc_project_events')
)
SELECT
  count(*) AS expected_tables,
  count(*) FILTER (WHERE to_regclass(format('public.%I',table_name)) IS NOT NULL) AS present_tables,
  COALESCE(
    array_agg(table_name ORDER BY table_name) FILTER
      (WHERE to_regclass(format('public.%I',table_name)) IS NULL),
    ARRAY[]::text[]
  ) AS missing_tables
FROM required;

-- B. Exact row counts for all 18 tables in one statement-level snapshot.
-- For pre-migration-007 backup/drill branches, some row counts may predate later writes;
-- do not compare live auth sessions or audit trails to an old branch as if synchronized.
SELECT 'user' AS table_name, count(*)::bigint AS rows FROM public."user"
UNION ALL SELECT 'session',count(*)::bigint FROM public."session"
UNION ALL SELECT 'account',count(*)::bigint FROM public."account"
UNION ALL SELECT 'verification',count(*)::bigint FROM public."verification"
UNION ALL SELECT 'cc_members',count(*)::bigint FROM public.cc_members
UNION ALL SELECT 'cc_tasks',count(*)::bigint FROM public.cc_tasks
UNION ALL SELECT 'cc_deliverables',count(*)::bigint FROM public.cc_deliverables
UNION ALL SELECT 'cc_reviews',count(*)::bigint FROM public.cc_reviews
UNION ALL SELECT 'cc_audit',count(*)::bigint FROM public.cc_audit
UNION ALL SELECT 'cc_team_invites',count(*)::bigint FROM public.cc_team_invites
UNION ALL SELECT 'cc_project_records',count(*)::bigint FROM public.cc_project_records
UNION ALL SELECT 'cc_project_record_events',count(*)::bigint FROM public.cc_project_record_events
UNION ALL SELECT 'cc_workstreams',count(*)::bigint FROM public.cc_workstreams
UNION ALL SELECT 'cc_workstream_events',count(*)::bigint FROM public.cc_workstream_events
UNION ALL SELECT 'cc_opportunities',count(*)::bigint FROM public.cc_opportunities
UNION ALL SELECT 'cc_opportunity_events',count(*)::bigint FROM public.cc_opportunity_events
UNION ALL SELECT 'cc_projects',count(*)::bigint FROM public.cc_projects
UNION ALL SELECT 'cc_project_events',count(*)::bigint FROM public.cc_project_events;
