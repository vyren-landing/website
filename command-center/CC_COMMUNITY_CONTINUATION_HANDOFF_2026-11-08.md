# VYREN Rev4.6 — Community / Contributor / Founder Grant Continuation Handoff
**Handoff date:** 2026-11-08 (Europe/Istanbul)
**Status:** OPERATING CONTINUATION — NOT A NEW CANONICAL PROTOCOL DECISION
**Scope:** Community, contributor access, Command Center operational tooling, and isolated QA only.
**Use:** Start a new chat without restarting the project. Verify live resources rather than trusting this snapshot blindly.

## 1 — Governing constraints and user corrections
1. The **only real operating user is Founder**. All earlier Contributor accounts/invitations, named people, tasks, test runs and simulated users are **QA, mock or draft**, not a currently onboarded real team. Do not describe them as actual Contributors.
2. Founder wants **simple direct permission management**, not invitation-driven onboarding: Community Member signs in voluntarily → Founder selects verified member → **Contributor Yetkisi Ver** or **Yetkiyi Kaldır**. Tie permission to authenticated Better Auth user/provider identity, never name or raw email alone.
3. Community and its English public content are separate from **private Contributor Team Space** and the Founder operational UI (Founder may use Turkish). Existing public read-only Community page uses **white/light theme** with categories General, Technology & Web3, Crypto & Ecosystem, VYREN Q&A, Ideas & Contributions, plus learning/contribution sections. Avoid fake activity.
4. Preserve **Rev4.6 canonical protocol architecture, FFA, GNR-STD-001 v1.3, No-Self-Lock/Solution Duty/Rights Protection, and no protocol voting/override/admin governance**. Operational UI records do not create canonical legal/protocol lifecycle decisions. No unapproved Genesis, tokenomics, public launch, provider or website changes.
5. Do not introduce restrictive provider dependencies merely to manage test accounts. Keep audit, data integrity and Founder recovery while allowing scoped cleanup/reclassification of synthetic test assets after backup.

## 2 — Code source of truth and prepared features
- GitHub: `vyren-landing/website`
- Working branch: `feature/command-center-phase2-auth-db-20261009`
- Current continuation commit in this chat: `b177c268c14bfa6aea2f69d3a7d10aad4768f975` (independent GitHub security CI file). This is a **snapshot**; fetch latest branch head next session.
- Read-only public Community: `command-center/app/community/page.tsx`
- Opt-in pilot join (currently gated): `app/community/join/**`, `app/api/community/membership/route.ts` (verified Google identity only; LinkedIn not configured).
- Founder member list: `app/secure/community-members-panel.tsx`; Founder API: `app/api/cc/community-members/route.ts`.
- Operational access check: `lib/phase2.ts`, centralized logic `lib/contributor-access.mjs`; legacy Team API `app/api/cc/team/route.ts`.
- Migration: `db/009_community_members_and_direct_grants.sql` (two additive tables).
- QA read-only endpoint: `app/api/qa/readiness/route.ts`, `lib/qa-readiness.mjs`.
- Tests: `tests/contributor-access.test.mjs`, `tests/qa-readiness.test.mjs`, `npm test`; the Vercel build script is `npm run test && next build`.
- Newly added GitHub workflow: `.github/workflows/cc-community-security-ci.yml` (unit tests, no Vercel deployment, no secrets). Added on 2026-11-08 to work around deployment API quota. **Workflow run result still needs verification.**

## 3 — Real infrastructure IDs / boundary
- Original Founder Command Center Vercel project **DO NOT ALTER**: `prj_dKnuIt9cz0eRRKSS8kwW9mqMx8aY`, `vyren-command-center`. Original Preview and Founder sessions must be preserved.
- Isolated **protected** QA Vercel project: `prj_mLYAX9Ivg7FyIuaWNNw6yxOnyEB2`, `vyren-community-auth-qa`. SSO deployment protection is enabled. `DATABASE_URL` bound as a **sensitive** variable to dedicated Neon QA branch only. Do not output or copy the credential.
- On QA project only: `CC_LIVE_ENABLED=false`, `CC_COMMUNITY_ENABLED=false`, `CC_QA_ISOLATED=true`, `CC_QA_PROJECT_ID=prj_mLYAX9Ivg7FyIuaWNNw6yxOnyEB2`. NO dedicated Better Auth secret, Founder QA GitHub ID, GitHub/Google OAuth credentials, or fixed callback host have been configured in this QA project.
- Neon project: `misty-cherry-51586446` (`vyren-command-center-db`).
- Main Neon branch **DO NOT MIGRATE by accident**: `br-wild-haze-b2j7fsqi`. Read-only check on 2026-11-08: **19 public tables**, both Community tables absent.
- QA Neon branch: `br-frosty-moon-b2pnll1d`, name `cc-community-009-qa-20261107`. Migration 009 has run ONLY here; **21 public tables, 0 community profiles, 0 grant rows**. Separate synthetic transaction tested member denied → grant → revoke → audit with rollback and confirmed 0 leftovers.
- Neon snapshot creation on main was **blocked by snapshot limit**. Do NOT delete existing backup just to force new snapshot. Current standalone QA branch is isolated; main backup/recovery prerequisites remain relevant to any eventual main migration.

## 4 — What has actually passed, and what has NOT
**PASS (historical, supported):**
- Prior independent SQL QA synthetic transaction on QA Neon branch: Community-only DENIED, Founder grant GRANT_OK, revoked access REVOKED_DENIED, audit constraints passed, full SAVEPOINT rollback; this is schema/SQL-level, NOT deployed HTTP auth.
- Prior authorization unit tests **28/28 PASS** in Vercel build on `2842830649d3`; read-only QA endpoint returned HTTP 200 on `5f580b8d3411`, `schemaReady=true, communityEnabled=false, commandCenterEnabled=false`.
- The isolated QA project returned HTTP 503 for membership and Founder grants while disabled and HTTP 200 for join page. Main Neon branch remains unmigrated.
**CURRENT UNVERIFIED SOURCE CHANGES (do NOT claim PASS):**
- Further code commits: `b4e91b7e` `410073fc` `7b8b5da8` `a0e91e6c` `b0ccac56`, plus readiness presence-check `64f36a2a`. These decouple **grant/revocation enforcement from public enrollment feature state** and allow Founder to revoke even if registration is closed, while preventing new grants. Four additional unit tests were added (source now contains **32 unit cases**, pending actual fresh CI run verification).
- 2026-11-07 Vercel create_deployment API was blocked with **HTTP 402 api-deployments-free-per-day / daily API cap**. Do not equate API error with application build failure. Do not change billing or deploy to production to bypass. CLI fallback not verified.
- On 2026-11-08, last three QA Vercel deployments showing ERROR were from **unrelated branch** `audit-wp14-r14-public-evidence-20261107`; each failed `Root Directory "command-center" does not exist`. This indicates auto-deploy triggering against wrong repo branch, **NOT** a Community source regression. Existing READY QA deployments persist. Investigate Git auto-deploy branch isolation only if safe without affecting Founder or unrelated project's pipelines.
- Newly committed GitHub Actions workflow runs independent Node policy tests on the target branch, with no deployment. **Observe its actual result and fix if needed.**

**NOT DONE:**
- Dedicated QA Better Auth credentials/secret and fixed Google/GitHub OAuth callbacks, legitimate test Founder provider identity, and QA authenticated HTTP E2E.
- No actual logged-in member signup, Founder grant/revoke HTTP call, session invalidation E2E, or access to protected tasks tested on QA via OAuth.
- No Community production/public registration; no public posts, comments, moderation tools, content creation, LinkedIn sign-in or public release.
- No main Neon migration or original Founder Vercel settings change.

## 5 — Exact next execution sequence
1. Fetch latest GitHub branch HEAD and GitHub Actions workflow status; verify the source tests actually pass outside Vercel. Do not mistake pushed tests for executed tests.
2. Inspect Vercel QA deployments for current status by `projectId=prj_mLYAX9Ivg7FyIuaWNNw6yxOnyEB2`; clearly separate unrelated-branch auto-deploy errors from valid target-branch build. Address wrong-branch trigger within QA only after checking Vercel Git linkage and ignoring incompatible branches safely. Avoid source changes that alter original Founder project.
3. Perform static/automated security review of `getActor()`, direct-grant and legacy invite routes: no privilege reactivation on flag closure, idempotent grant/revoke, correct role/active checks, session deletion, transactional audit, CSRF same-origin, unique identity binding. Add security tests where needed. Run GitHub workflow and build checks.
4. Before actual authenticated QA E2E: provision **QA-only**, separate Google/GitHub OAuth credentials + `BETTER_AUTH_SECRET`, fixed QA callback host; ensure SSO remains enabled; ensure **no Founder production credentials or sessions are reused**. No backdoor identity shortcut or real community activation.
5. Only within isolated QA scope, test real signed-in member → Founder-only list → grant → private workspace authorization → revoke → old session denial → audit. Record actual HTTP statuses as evidence.
6. After that, prepare and build public Community posts/replies/ideas with moderation/rate limits and privacy controls, keeping read-only preview until its own gate.
7. Update this handoff and existing runbook, marking each item PASS only with actual proof.

## 6 — Existing runbook and links
- `command-center/CC_COMMUNITY_MEMBERSHIP_009_PREVIEW_RUNBOOK_2026-11-07.md` has detailed chronological QA and security history. Earlier top-line `MIGRATION 009 NOT EXECUTED` refers to original/main database; migration has been applied on QA only. Read scope and latest addenda together.
- Source branch: https://github.com/vyren-landing/website/tree/feature/command-center-phase2-auth-db-20261009/command-center
- This handoff: https://github.com/vyren-landing/website/blob/feature/command-center-phase2-auth-db-20261009/command-center/CC_COMMUNITY_CONTINUATION_HANDOFF_2026-11-08.md

## 7 — Ready-to-use starter prompt for new ChatGPT topic
> VYREN Rev4.6 Community / Contributor / Founder Direct Grant + Command Center çalışmasına kaldığımız yerden devam edelim. Önce GitHub `vyren-landing/website` repo içindeki `feature/command-center-phase2-auth-db-20261009` dalında `command-center/CC_COMMUNITY_CONTINUATION_HANDOFF_2026-11-08.md` dosyasını ve `CC_COMMUNITY_MEMBERSHIP_009_PREVIEW_RUNBOOK_2026-11-07.md` kaydını oku; güncel GitHub HEAD, Vercel/Neon durumuyla yeniden doğrula. Tek gerçek kullanıcı Founder; diğerleri test/taslak/QA. Beyaz zeminli sade Community, Founder'ın üye listesinden doğrudan Contributor yetkisi verebilmesi, FFA/GNR-STD-001 v1.3 No-Self-Lock ve Rev4.6 protokol ayrımı korunacak. Önceden tamamlanan işleri sıfırdan açma. Ana Neon branch `br-wild-haze-b2j7fsqi` ve original Founder Vercel project `prj_dKnuIt9cz0eRRKSS8kwW9mqMx8aY` üzerinde değişiklik yapma. Ayrı QA Vercel `prj_mLYAX9Ivg7FyIuaWNNw6yxOnyEB2` ve Neon QA `br-frosty-moon-b2pnll1d` ile ilerle. Son kaynak düzeltmelerinin testleri gerçek CI üzerinden doğrulanmadı; GitHub workflow durumunu ve Vercel quota/yanlış branch deployment problemini çöz; gerçek OAuth HTTP E2E yapılana kadar PASS deme. UI/Community üyeliğini kamuya açma. Sıradaki incomplete execution point'ten devam et; sonuçları bu iki kayda işle. Ayrıca en güncel controlling Master/Lifecycle/GNR/FFA/VDCP belgelerinin operational scope dışına taşılmasını önle ve omission is not supersession ilkesini uygula.
