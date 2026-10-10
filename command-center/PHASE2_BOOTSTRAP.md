# Command Center Phase 2 - Safe bootstrap

> **Current status (2026-10-10):** This file preserves the original Phase-2 setup checklist as **historical bootstrap instructions**, not the current incomplete-work list. Authenticated Preview workspace, team/Contributor isolation and local encrypted backup/recovery QA have been tested. No real operational team is onboarded. The controlling current development status, scope limits and DEFERRED Google Drive automation are in [EXECUTION_STATUS_LEDGER_2026-10-10.md](./EXECUTION_STATUS_LEDGER_2026-10-10.md). Do not repeat completed bootstrap or turn deferred backup OAuth into a mandatory gate.


Scope: separate Vercel project `vyren-command-center`, repo folder `command-center/`.
Branch: `feature/command-center-phase2-auth-db-20261009`. Do not merge or
promote until all gates are checked. Public VYREN site and canonical data are out of scope.

## Current deployment posture
The earlier browser-only demo is preserved at root until the secure workspace is verified.
The new `/secure` route fails closed when required environment keys are missing. A
Vercel authentication barrier on Preview is additional deployment protection, not
application role authorization.

## Prerequisites requiring account-owner action
1. In Vercel's `vyren-command-center` project, Storage/Marketplace:
   provision a dedicated Neon Postgres database on the **Preview** environment
   (not the website project). Confirm `DATABASE_URL` exists. Do not print its value.
   If provisioning would add a paid resource, review the pricing first.
2. In the GitHub account `vyren-landing`, create an OAuth App for the
   **stable preview branch alias**. Use its URL as Homepage URL, and
   `https://<stable-branch-alias>/api/auth/callback/github` as callback.
   Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in the Vercel Command Center
   Preview environment, not the repository. **Do not share secrets in chat.**
3. Set BETTER_AUTH_SECRET (32+ bytes), FOUNDER_GITHUB_ACCOUNT_ID=249065858
   (verified from the currently connected GitHub account); do not enable
   TEST_GITHUB_ACCOUNT_ID until a separate real test account is verified.
4. Keep `CC_LIVE_ENABLED=false` until the end-to-end isolated test is complete.

## After environment linking
- Verify key NAMES only; never reveal or log values.
- Pull env locally only to a secure, ignored `.env.local`.
- Run Better Auth's version-matched `auth migrate` (creates user/session/account/verification),
  review its SQL, then apply `db/001_phase2_core.sql` exactly once through a
  migration runner; ensure it is a transaction.
- Ensure database backup/restore and provider-neutral SQL export before live use.
- Check OAuth login of `vyren-landing`; it becomes Founder by exact numeric
  GitHub account ID. Every other GitHub login stays unauthorized unless its
  numeric ID is explicitly listed as the one test contributor.
- Visit `/secure`, verify session, no access for unauthorized logins,
  task CRUD, report submission, review, revision, audit, and persistence between
  browsers. Confirm CSRF and owner-filtered API.
- Only then activate `CC_LIVE_ENABLED=true` on an approved environment and
  disable the public demo route; do not invite the actual VYREN contributors
  without explicit approval.

## Scope and non-regression
Operational tasks have no access to VYREN protocol governance, financial rights,
treasury, external provider commitments, lifecycle PASS state, or signed actions.
No production data or old browser demo data are imported automatically.
Use migration exports/backups to avoid provider or account self-lock.

## Phase 2 boundary
Auth + database is **prepared**, not **activated**, until a real Neon integration,
OAuth credentials, database migrations, and authenticated cross-user tests pass.
