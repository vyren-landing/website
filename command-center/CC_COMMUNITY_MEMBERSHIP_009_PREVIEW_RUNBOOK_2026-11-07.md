# VYREN Command Center — Community Membership + Founder Direct Grants / Preview Runbook
**Date:** 2026-11-07
**Scope:** Command Center separate Vercel Preview and its connected Neon PostgreSQL only.
**Status:** SOURCE PREPARED; MIGRATION 009 NOT EXECUTED; FEATURE DISABLED; REAL-USER E2E NOT VERIFIED.
**Authority:** Operational membership and access only, not Rev4.6 canonical governance, Founder rights/FFA, GNR, Genesis or lifecycle approval.

## User-confirmed operational participant status (2026-11-07 correction)
**Founder is the only real operating user at this stage.** All other Contributor identities, invitation entries, team/task/person examples, QA accounts and draft records created so far are **test, mock, draft or validation fixtures**, not an active real contributor team or public membership. OAuth login may still have used a technically real identity; this does not make the person a real onboarded VYREN Contributor.

Consequences for implementation and QA:
- Do not describe the database as containing established real Contributor users, an operational real team, or real community members. Historical Founder/Contributor test outcomes remain valid **bounded QA evidence**, not actual-team activation.
- The existing Google/GitHub test identities, invite fixtures, task/submission evidence and audit records can be exercised, reclassified, reset or retired **as test assets** where justified, after explicit scope identification, database backup/recovery and audit retention. They are not inherently protected as permanent real team membership.
- **Do not change or accidentally lock the sole real Founder account**, its identity, active sessions, rights, security or operational access; do not broadly delete test data without a targeted cleanup/evidence plan.
- Treat any future real Contributor/public community onboarding as a **new, deliberate activation**, with the Founder granting Contributor authority directly from the member list. No fabricated assumption that Josh or other names are already active real contributors.
- The prior phrase `existing users' permissions were not changed` should be read only as a technical change-control observation about test accounts, **not** a claim that there are real non-Founder users needing continuity protection.
- GNR/FFA Founder protections, data integrity, non-regression, anti-self-lock and recovery still apply. This correction narrows the *classification of people*, not the protective quality bar of the system.

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
2. Confirm current schema and row inventory; record 19-table baseline on the exact connected Neon branch.
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
- Confirm no regression in existing test Google invitation/Contributor flows and Founder OAuth. The Founder is the sole real operating user; test identities remain regression fixtures, not a live team.
- Enable `CC_COMMUNITY_ENABLED=true` **only** in the intended Preview environment, after new tables and authorization checks are ready. Do not enable production.
- The Founder **must** explicitly authorize any future real person's Contributor promotion. Tests may operate on controlled, clearly classified fixtures with evidence and recovery, but must not affect the Founder identity, sessions or access.

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
Stop if unexpected current Neon branch, migration mismatch, grant-versus-invite ambiguity, partial restore evidence, account collision, unauthorized private endpoint, or any Founder/FFA/GNR regression occurs. Do not fix by affecting the sole real Founder account, indiscriminately deleting QA/evidence records, rewriting histories or overwriting main. Scoped test-fixture cleanup is permissible only with recorded classification and recovery. Prefer a small forward corrective change.


## 2026-11-07 continuation checkpoint — non-destructive
- Preview alias confirmed READY at `dd12621a68ee9938d735a81fcb8f298ea9382546`. Subsequent security patches are committed, not yet all independently READY or E2E-verified.
- `53d27b80`: revocation continues to work even if the target account's email verification state changes. Verification is required to grant, not to revoke.
- `39a9a602`: operational session-resolution upsert no longer overwrites `cc_members.role` or reactivates an existing disabled member; user restoration is a separate Founder action.
- `e19ca1f3`: legacy team enable/disable action cannot override an explicit community direct-grant row. Founder Community Members controls that access independently.
- Vercel project env metadata (no secret values decrypted) confirms `DATABASE_URL` is defined for Preview, with a branch-specific `BETTER_AUTH_URL`; `CC_COMMUNITY_ENABLED` **was not listed**. This is not proof of which Neon branch the secret references. No target data was read and no migration was executed.
- User connected Neon in this conversation, but the connected Neon execution tools were not exposed by the current tool registry. Proceed with direct read-only Neon verification once those tools become available; do not falsely claim completion.
- **STOP:** Before executing migration 009, confirm live database identity + current backup checkpoint/isolated recovery + explicit target against actual Neon source. Keep feature disabled and do not touch existing sessions, grants or identities.
- Latest verified stage at checkpoint: `SOURCE PREPARED / SELECTIVE BUILD PASS / DB UNCHANGED / NO LIVE E2E`.

## 2026-11-07 Neon QA-branch evidence checkpoint
- Connected Neon project: `vyren-command-center-db` (`misty-cherry-51586446`); source/default branch `main` (`br-wild-haze-b2j7fsqi`); separate QA branch `cc-community-009-qa-20261107` (`br-frosty-moon-b2pnll1d`) created from parent LSN `0/2443B18`. QA is a copy, **not** an assertion that it is Vercel's currently selected database branch.
- **Real baseline correction:** `main` has 19 public base tables, of which 14 start `cc_`; `cc_community_profiles` and `cc_contributor_grants` absent before migration. The earlier reference to 18 existing tables was outdated.
- `db/009_community_members_and_direct_grants.sql` was applied as the three CREATE statements in one Neon transaction **ONLY ON THE QA BRANCH**; result success. On QA, 21 total tables, exactly one each profile/grant table, both new tables initially contain 0 rows. At verification `cc_members=3`, `cc_team_invites=1` on the QA copy, without treating those as real contributors.
- FK, primary key, required columns and `active -> granted_by/granted_at` CHECK were independently inspected on QA using database schema metadata. This is **SCHEMA QA PASS ONLY**. Real OAuth, Founder grant/revoke, session denial, backup restore and role regression are NOT E2E PASS.
- A new snapshot of source main was attempted but Neon returned **HTTP 422 snapshots limit exceeded**. Existing 2026-10-10 snapshot was not deleted. A separate QA branch was created instead. No migration or application data mutation was performed on main.
- Vercel feature-branch deployment `7ab7323245c9` reached READY after source hardening and Founder-only-user status correction, but is **not** a real account-role functional test. Branch-changing Vercel envs, `CC_COMMUNITY_ENABLED`, published website and live identity records were not modified.
- **NEXT:** test roles/route denial against controlled QA account identities after isolating auth host and Preview database target. Do not flip CC_COMMUNITY_ENABLED or run migration 009 on main merely on the strength of schema QA.
