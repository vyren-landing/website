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


## 2026-11-07 operational role policy unit QA checkpoint
- The Founder has clarified that **Founder is the only real user**; others are QA/test/draft. No live team onboarding is being claimed.
- Added source-controlled `lib/contributor-access.mjs`: centralized operational authority decision for Founder, legacy test/invite identity, active Founder direct grant, revoked direct grant, and `cc_members` active/role match. The source policy is used by the real `getActor()` role path and the Founder direct-grant API.
- Added `tests/contributor-access.test.mjs`; `npm test` uses Node's built-in test runner. Local isolated runner reports **20/20 unit tests PASS** including revoked-grant override, incorrect role/inactive account denial, Founder self-modification denial, unverified account rejection, and revocation despite lost email verification.
- UNIT PASS does not equal authenticated live OAuth E2E. No real session, sign-in, task ownership, API status-code E2E, or role swap was performed.
- The distinct Neon QA branch `br-frosty-moon-b2pnll1d` has schema 009; the main branch is untouched. **No Community feature flags or Vercel DATABASE_URL variables were changed.**
- GitHub runtime-integrating commits: `eaf171ef`, `b2a92dfb`; `6db86046` registers the test script. Await current Vercel build and authenticated QA before enabling feature.
- **Open prerequisite:** actual QA OAuth host + independently isolated Vercel Preview pointing at QA Neon branch; do not redirect existing Founder Preview to QA without a tested preservation/rollback path.


## 2026-11-07 synthetic Neon QA grant/revoke transaction checkpoint
- Verified Vercel deployed revision `2f471fc238b4` was READY (build only). Latest source `lib/contributor-access.mjs`, `lib/phase2.ts`, Founder grant route use centralized policy and `npm test` is registered.
- Executed the exact 20 checked-in `contributor-access.test.mjs` assertions via Node.js v22.16.0 in an isolated container, with a local copy matching fetched source: **20 tests PASS / 0 FAIL**. This is actual policy **unit test** execution, not authenticated HTTP or OAuth E2E.
- On Neon **QA branch only** `br-frosty-moon-b2pnll1d`, ran a **15-statement transactional synthetic fixture lifecycle**, using unique `.invalid` QA identities. It tested: an unaffiliated Community profile has **DENIED** workspace role, a Founder-attributed active grant plus matching active Contributor row returns **GRANT_OK**, and explicit revocation plus inactive member row returns **REVOKED_DENIED**. Both audit inserts satisfied existing FK constraints.
- All synthetic inserts and updates were enclosed in a SQL **SAVEPOINT** and explicitly reverted with `ROLLBACK TO SAVEPOINT` before transaction completion. Post-transaction independent QA query: **0 QA users, 0 community profiles, 0 grants, 0 synthetic audit entries**. Main Neon branch separately verified to lack both 009 tables; no changes applied to main or live Founder.
- These SQL checks validate DB schema, FK, and lifecycle state transitions; **they do NOT invoke the deployed HTTP API, a real Better Auth/Google OAuth login, session revocation or protected task authorization.** Do not claim real-user E2E PASS.
- Feature flag remains disabled by default; public membership/sign-up is not open. The next live-HTTP step must use a separate fixed auth hostname and Vercel Preview environment explicitly bound to the isolated QA Neon branch, without changing the existing Founder Preview URL or DB target.


## 2026-11-07 enforced build gate and isolated HTTP QA next gate
- On the working feature branch, `package.json` build now runs `npm run test && next build` (commit `5a205d79`). Vercel build output independently showed **20 tests / 20 PASS / 0 FAIL** before proceeding to Next.js compilation. A passing test suite is distinct from the final READY state; check current deployment status separately.
- Vercel project `vyren-command-center` Preview env has `DATABASE_URL`, `GOOGLE_CLIENT_ID`, branch-scoped `BETTER_AUTH_URL` and `CC_LIVE_ENABLED`; `CC_COMMUNITY_ENABLED` was not set. The existing Preview's `DATABASE_URL` **must not be replaced** with QA credentials, because it could affect the Founder and existing sign-in flows.
- QA Neon branch `br-frosty-moon-b2pnll1d` still contains **0 new community profiles and 0 direct grants** at latest verification. The baseline 19-table main branch is not migrated. Founder remains the sole real operating user.
- A separately provisioned test Vercel app (or equivalently isolated, explicitly scoped auth host) must have its *own* Better Auth host and OAuth callback, tested secret/environment binding, and **only** the isolated QA Neon branch. Do not copy founder production/preview sessions or use a publicly reachable auth test bypass.
- Authenticated HTTP tests still pending: anonymous 401/403/503 fail-closed; verified Google opt-in; community-only account denied all private workspace endpoints; Founder-only member-list/grant; eligible direct grant; immediate revoke + old session denied; legacy test Contributor isolation; restoration and audit; rate limit/moderation checks before opening registration.
- No actual separate OAuth/HTTP test environment, public Community enrollment, or real-user grant is claimed as provisioned by this checkpoint. No Vercel environment variables or Neon main branch data were changed.


## 2026-11-07 isolated Vercel QA project establishment
- Created **separate** protected Vercel app `vyren-community-auth-qa`, project `prj_mLYAX9Ivg7FyIuaWNNw6yxOnyEB2`, with `command-center` root linked to `vyren-landing/website`. This is a distinct Vercel project from existing Founder workspace `prj_dKnuIt9cz0eRRKSS8kwW9mqMx8aY`.
- Verified **Vercel SSO deployment protection enabled for ALL deployments** on isolated project. Original Founder Preview deployment and original Vercel environment variables were not modified.
- Set `CC_LIVE_ENABLED=false` and `CC_COMMUNITY_ENABLED=false` on the independent QA app for both Preview and Production targets. In this configuration, operational sign-in and Community registration remain fail-closed. **No GitHub/Google OAuth credentials, Better Auth secret, Founder account ID, or sessions were copied** from existing Founder app.
- Connected an isolated `DATABASE_URL` as a **sensitive** Vercel variable only on the **new QA project**, after validating Neon returned `Branch ID: br-frosty-moon-b2pnll1d`. Do not print or commit the URI. Note: this is still an owner-level database credential; rotate/restrict at final handoff if needed. Never repoint the existing Founder app to this branch.
- First new QA deployment `dpl_AQN8mnfUcr7g5x4BriL6akMwEM9Q` became READY. A second deployment `dpl_6igP8JaeZtjt3fypWz5JUtTibsSk` was launched to capture the newly configured QA project environment, and its build logs showed **20 tests / 20 pass / 0 fail**; latest READY state must be verified separately.
- Independently confirmed main Neon database remains **19 public tables, no 009 tables**; isolated QA Neon database **21 public tables, zero community profiles and zero Contributor grants**.
- **Do NOT claim authenticated HTTP E2E PASS.** OAuth test credentials, callback registration, isolated test-only actor identities, protected URL access automation and a safe QA auth seed must be configured before real auth/grant/revoke HTTP tests. Creating a Vercel QA project alone does not test Google login.
- IMPORTANT: Vercel initially labeled the first isolated QA deployment target `production` *within the QA project*. This is **not** the existing Founder workspace or public VYREN.IO production. SSO is on for every QA deployment and both feature flags are false. Avoid marketing this QA project as a public app.


## 2026-11-07 isolated QA read-only HTTP verification
- Added server route `GET /api/qa/readiness` and project-identity feature guard in `lib/qa-readiness.mjs`. Only the dedicated protected Vercel QA project can enable this non-mutating route; disabled elsewhere with 404. Added eight QA gate test cases; total policy tests **28 PASS / 0 FAIL** in Vercel build logs at `2842830649d3`.
- Added `CC_QA_ISOLATED=true` and `CC_QA_PROJECT_ID=prj_mLYAX9Ivg7FyIuaWNNw6yxOnyEB2` **only** to the QA Vercel project. The explicit identity fallback was necessary because the initial deployed QA check returned 404 without VERCEL_PROJECT_ID in the runtime environment. The guard still requires that identity plus CC_QA_ISOLATED and an allowed Vercel environment.
- **Actual authenticated platform fetch** of `https://vyren-community-auth-nd8emzzxn-vyrenlabs-projects.vercel.app/api/qa/readiness` on READY commit `5f580b8d3411` returned **HTTP 200** and JSON: schemaReady=true, communityEnabled=false, commandCenterEnabled=false, noRealUsersProvisioned=true (this last field means only zero Community profiles/grants, not that the underlying copied auth database contains no test users).
- Previous READY deployment `b330e049585b` yielded **HTTP 503** on each of `/api/community/membership` and `/api/cc/community-members`, and **HTTP 200** on `/community/join`. The new readiness route's initial 404 was investigated and repaired via explicit project-local identity variable; no permissive bypass was introduced.
- No real OAuth sign-in, POST grant or revoke was attempted; **real HTTP E2E remains pending**. QA Neon branch remains isolated, original main Neon lacks migration 009, and the Founder application environment was not modified.
- STOP: isolated readiness confirms schema presence and feature flags, **not** configured Better Auth provider credentials. To test the real flow next, establish dedicated QA OAuth provider credentials, fixed callback URL, separate Better Auth secret and Founder *test identity* only on QA, then activate features only behind SSO with appropriate test accounts, controls and rate limits. Never reuse the sole real Founder identity or unset deployment protection.


## 2026-11-07 enrollment-closure authorization hardening
- Security finding: `getActor()` previously consulted direct grants only when `CC_COMMUNITY_ENABLED=true`. Disabling enrollment could make direct-grant revocations fall through to a legacy invitation/test Contributor path. This would be an unsafe authority coupling, not a reason to keep public membership open.
- Changed the operational authorization path to discover whether 009 tables are installed and honor active/revoked direct grants **even when Community enrollment is closed**. A missing 009 schema remains compatible with existing Founder/legacy login.
- Updated legacy Team enable/disable checks to respect direct-grant rows independently of `CC_COMMUNITY_ENABLED`, so closing enrollment cannot restore an explicitly revoked member.
- Founder direct grant route now allows inspection and **revocation** when enrollment is closed and 009 tables exist, but refuses **new grants** while closed. `GET` remains Founder-authenticated; no public member list is exposed.
- Added four unit tests covering grant/revoke during enrollment closure, migration absence, and normal open enrollment. Test count grows from **28 to 32**. These are source assertions; wait for Vercel build before marking fresh count PASS.
- Isolated QA `/api/qa/readiness` now reports **presence booleans only** for auth secret, Github OAuth, Founder test ID, Google OAuth, and fixed callback host, without returning any secret or account identifier. Protected QA project only.
- No Community enrollment activation, no copied Founder credentials, no DB migration on main, no real OAuth signup and no live user grants. Real OAuth/HTTP E2E remains pending dedicated provider setup.


## 2026-11-08 new-topic handoff — controlling operational checkpoint
- Full new-topic handoff prepared at `command-center/CC_COMMUNITY_CONTINUATION_HANDOFF_2026-11-08.md` (GitHub branch `feature/command-center-phase2-auth-db-20261009`). Includes current task-state, tested/unverified boundaries, resource IDs, exact next action and copy-ready continuation prompt.
- 2026-11-08 inspection: Vercel QA's latest three ERROR builds (`818ab796`, `520a033d`, `c3d0b9ac`) originated from **unrelated Git branch** `audit-wp14-r14-public-evidence-20261107` and failed because that branch lacks `command-center` root. Do not misclassify as the Community source build failing. Prior Community QA deployments still READY; GitHub branch HEAD and CI checks may change.
- The quota-related Vercel create_deployment attempt returned `402 api-deployments-free-per-day`; it did **not** compile the new code. Avoid bypassing with a production deploy or billing changes without approval.
- Added standalone non-deploying workflow `.github/workflows/cc-community-security-ci.yml` on Community feature branch, commit `b177c268`. It runs `node --test tests/*.test.mjs` without secrets or deployment. **The workflow outcome has not yet been observed**, so 32-case source test update is NOT independently CI PASS.
- At handoff: main Neon 19 public tables/no Community tables; QA Neon two new Community tables remain empty. Original Founder Vercel app and live VYREN.IO unchanged.
- GitHub check inspection on subsequent handoff commit `0b33f401` showed Vercel statuses **pending**. Do not state current code is READY until specific commit/deployment evidence exists.
- Next execution: inspect Github workflow logs/checks; review project-specific Git auto-deployment triggers (wrong branch), then isolate dedicated QA OAuth config for eventual authenticated E2E. Keep `CC_LIVE_ENABLED=false`, `CC_COMMUNITY_ENABLED=false` until verified.
