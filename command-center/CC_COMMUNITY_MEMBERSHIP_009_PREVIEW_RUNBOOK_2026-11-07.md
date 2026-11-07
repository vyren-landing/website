# VYREN Command Center — Community Membership + Founder Direct Grants / Preview Runbook
**Date:** 2026-11-07
**Scope:** Command Center separate Vercel Preview and its connected Neon PostgreSQL only.
**Status:** SOURCE PREPARED; MIGRATION 009 NOT EXECUTED; FEATURE DISABLED; REAL-USER E2E NOT VERIFIED.
**Authority:** Operational membership and access only, not Rev4.6 canonical governance, Founder rights/FFA, GNR, Genesis or lifecycle approval.

## What is in source
- `db/009_community_members_and_direct_grants.sql` introduces two additive tables. Existing `cc_members`, `cc_team_invites`, Better Auth user/session/account and task/project history schema are unchanged.
- `CC_COMMUNITY_ENABLED` is **disabled by default**. No membership or direct grant route works until the operator explicitly enables it after migration and validation.
- `/community/join` is a separate, opt-in registration view. Pilot registration uses a **verified Google OAuth identity**, with no implicit account linking. LinkedIn remains pending provider configuration and tests.
- `/api/community/membership` checks a verified Google provider account, affirmative consent, same-origin JSON POST and feature flag. It adds or updates **only the user's own** community profile.
- `/api/cc/community-members` is Founder-only. It lists joined community profiles and grants/revokes Contributor authority by exact authenticated Better Auth user ID. A current invited/test Contributor cannot be silently converted to the new grant path.
- Team screen contains the minimal direct-grant list; it is absent when the feature is disabled.
- `getActor()` preserves Founder GitHub identity and existing Google invitation logic. New grant precedence applies only with `CC_COMMUNITY_ENABLED=true`: an explicitly revoked direct grant cannot fall through to a legacy invite and regain access.

## Required before migration execution
1. Verify project/team and **actual Vercel Preview DATABASE_URL target branch** through platform UI, no secret values in chat.
2. Confirm current schema and row inventory; record 18-table baseline on the exact connected Neon branch.
3. Preserve a recoverable checkpoint and independently retained encrypted PostgreSQL backup. Existing historical 2026-10-11 backup equality is not a current November 7 checkpoint.
4. Inspect exact SQL; confirm only CREATE TABLE/INDEX and no backfill or changes to existing rows.
5. Run migration only once, in a transaction, on the specifically authorized Preview database. Never run it merely by a Git push.
6. Confirm the two tables with read-only SQL and no old-table row changes. For example:
   ```sql
   SELECT to_regclass('public.cc_community_profiles') AS profiles,
          to_regclass('public.cc_contributor_grants') AS grants;
   SELECT COUNT(*) FROM cc_community_profiles;
   SELECT COUNT(*) FROM cc_contributor_grants;
   ```
7. Record **migration applied** separately; code deployment success does not imply DB migration success.

## Safe feature activation prerequisites
- Verify privacy notice/community rules and reasonable moderation/abuse pathway for actual public membership. Avoid opening public registration to real users before policy and rate-limit review.
- Inspect stable BETTER_AUTH_URL and Google OAuth callback; never use a one-off deployment URL for account activation.
- Confirm no Google invitation, existing Contributor, or Founder OAuth regression. Keep current approved users working.
- Enable `CC_COMMUNITY_ENABLED=true` **only** in the intended Preview environment, after new tables and authorization checks are ready. Do not enable production.
- The Founder **must** explicitly authorize any real person's Contributor promotion; tests must not change existing users, including currently invited Contributors.

## QA matrix (test identities only when available)
| Test | Expected |
|---|---|
| Feature disabled | Join page is informative only; membership API returns 503; existing /secure still works |
| New verified Google user | Community join can record consent and optional voluntary-contribution interest |
| General public member | Cannot access /secure, /api/cc tasks, Founder modules, TEAM content or other member records |
| Founder member list | Only Founder gets list; Contributor/Community account receives 403 |
| Founder grant to an eligible test identity | Exact user gains Contributor, existing assigned-task semantics apply |
| Founder revoke | Access denied immediately by server; sessions cleared; existing task/deliverable history untouched |
| Legacy invitation | Existing invited Contributors continue to work, legacy revoke cannot be bypassed by a direct grant |
| Founder identity | Cannot be changed/granted/revoked via community controls |
| Audit / recovery | Grant and revoke append a cc_audit entry; new tables included in encrypted backup and isolated restore |
| Security + UI regression | Existing 15/15 negative authorization suite rerun; Founder Turkish, Contributor/member English; light-theme responsive visual check |

These are **planned QA assertions, NOT passed tests**.

## Non-goals for this batch
No public posts/comments, Team Space discussion records, LinkedIn production OAuth, external account permissions, community governance vote, token allocation, payment, actual production user onboarding, DNS or public website change.

## Stop rules
Stop if unexpected current Neon branch, migration mismatch, grant-versus-invite ambiguity, partial restore evidence, account collision, unauthorized private endpoint, or any Founder/FFA/GNR regression occurs. Do not fix with disabling existing members, deleting QA tasks, rewriting histories or overwriting main. Prefer a small forward corrective change.
