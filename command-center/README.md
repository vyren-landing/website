# VYREN Command Center — Authenticated Operational Preview

**Current stage:** independent Vercel Preview backed by Neon PostgreSQL and server-side Founder / Contributor permissions. This application is **not** the public VYREN website or a production release.

## Scope and boundaries

Command Center tracks operational assignments, project records, workstreams, opportunities, team invitations, progress and history. It does **not** control or modify canonical VYREN Rev4.6 protocol economics, founder rights, FFA, governance, VDCP acceptance or Genesis lifecycle decisions. Operational status is never protocol authority.

## Current capabilities and evidence

- Better Auth: GitHub Founder identity; Google invited Contributor flow, plus configured test identities; persistent `cc_members` and PostgreSQL-based role checks.
- Server-side task ownership and Founder-only API guards. Contributor access regression: **15/15 PASS**, including four Founder-module GET denial checks.
- Operational projects, records, workstreams and opportunities with revision/event history and archive/restore. Founder-reported Preview module structural check and revision sequences: PASS.
- Contributor position labels and Founder task-distribution panel: migration 007 applied to Preview-connected Neon `main` branch, schema and user-reported UI checks PASS.
- Neon recovery safeguards: user-created `backup-cc-before-007-20261011` and `cc-recovery-drill-20261011`; selected table count and MD5 parity observed. This is **not** a complete database restore or external/off-provider backup.
- Fresh independent Google invite/login/revoke/reactivation E2E: **DEFERRED / UNVERIFIED** (no third test identity); continue other development without touching existing Contributor access.

See `CC_PROJECT_LINK_01_PREVIEW_QA_2026-10-11.md` for dated evidence and bounded claims.

## Database schema and recovery

- `db/001_phase2_core.sql` through `db/007_contributor_position_titles.sql` are migrations applied to the **approved Preview database** manually. `db/008_read_only_full_inventory.sql` is **NOT A MIGRATION**: it executes SELECTs only to report schema presence and counts of all 18 known Better Auth and Command Center tables.
- Before any risky change: verify the intended Neon branch and Preview connection, retain a recoverable database checkpoint, and document what was tested.
- For a recovery drill, restore into a **new isolated branch**, never overwrite or reset `main`. Compare the schema and table inventories; verify application behavior and record a safe recovery route.
- Neon same-project branches/snapshots are not independent offsite backup. PITR/history availability depends on the specific Neon plan and configured restore window. Verify those settings in the Neon Console; do not assume a retention period from generic documentation.
- An independent backup may use PostgreSQL `pg_dump` into encrypted private storage (never a Git commit or public artifact); validate it with `pg_restore` on an isolated target. Do not copy user emails, account/session identifiers, OAuth secrets, cookie/session records or database connection URLs into the repository, QA logs or chat.

## Hosting

- Git branch: `feature/command-center-phase2-auth-db-20261009`.
- Vercel Preview: `https://vyren-command-center-git-feature-comm-8a904a-vyrenlabs-projects.vercel.app/secure`.
- Separate Vercel project: `vyren-command-center`.
- Never promote this branch to production or touch `vyren.io` without explicit authorization.

## Open readiness items

1. Verify Neon restore window/snapshot settings and test an isolated **point-in-time restore** if supported; independent encrypted backup and test restore remain separate tasks.
2. Complete fresh-user invitation lifecycle E2E when an independent controlled Google account is naturally available. Do not disable existing Contributors solely to manufacture the test.
3. Expand regression coverage for normal operations and recovery beyond the current limited Preview QA.
4. Release engineering/security review before external production onboarding.

## Local development

Run from `command-center/` after locally configuring **your own secured** environment:

```bash
npm install
npm run dev
```

Never commit `.env`, database URLs, access tokens or downloaded private database dumps.
