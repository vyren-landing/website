-- VYREN Command Center — read-only 18-table content fingerprint comparison.
-- VERIFICATION SCRIPT ONLY; NOT A MIGRATION. NO tables/data are changed.
-- Run ONCE per intentionally selected Neon branch (main and isolated PITR drill).
-- Record branch name and source timestamp OUTSIDE these SQL results.
-- Only aggregate count/hash leaves PostgreSQL; auth/session/account records remain private.
-- Deterministic aggregate hash includes ALL columns and duplicate rows, independent of row order.
-- Intended for the current small Preview dataset. For large production tables, use a
-- chunked external secure backup verification approach instead of string_agg.
-- A row-content match increases assurance but does not independently prove correct
-- point-in-time selection, application login, provider retention, or disaster recovery.
-- Different session/audit records can legitimately reflect PITR timestamp or live churn.

SELECT 'user' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."user" t
UNION ALL
SELECT 'session' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."session" t
UNION ALL
SELECT 'account' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."account" t
UNION ALL
SELECT 'verification' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."verification" t
UNION ALL
SELECT 'cc_members' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_members" t
UNION ALL
SELECT 'cc_tasks' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_tasks" t
UNION ALL
SELECT 'cc_deliverables' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_deliverables" t
UNION ALL
SELECT 'cc_reviews' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_reviews" t
UNION ALL
SELECT 'cc_audit' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_audit" t
UNION ALL
SELECT 'cc_team_invites' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_team_invites" t
UNION ALL
SELECT 'cc_project_records' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_project_records" t
UNION ALL
SELECT 'cc_project_record_events' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_project_record_events" t
UNION ALL
SELECT 'cc_workstreams' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_workstreams" t
UNION ALL
SELECT 'cc_workstream_events' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_workstream_events" t
UNION ALL
SELECT 'cc_opportunities' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_opportunities" t
UNION ALL
SELECT 'cc_opportunity_events' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_opportunity_events" t
UNION ALL
SELECT 'cc_projects' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_projects" t
UNION ALL
SELECT 'cc_project_events' AS table_name,
       count(*)::bigint AS row_count,
       md5(coalesce(string_agg(md5(to_jsonb(t)::text), '' ORDER BY md5(to_jsonb(t)::text)), '')) AS content_fingerprint
FROM public."cc_project_events" t
ORDER BY table_name;
