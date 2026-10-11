# VYREN Command Center — Preview database recovery playbook (2026-10-11)

Scope: Command Center operational Neon PostgreSQL only; not VYREN canonical architecture or production go-live approval. **Never use Restore/Reset against a live branch as a verification exercise.**

## Verified source observations

Neon Console, project `vyren-command-center-db`, branch `main`, Backup & Restore, user-supplied 2026-10-11:
- Restore from history: last **6 hours** (actual console setting; this is not a 6-hour scheduled snapshot cadence).
- One snapshot of `main`: approx. 1 day old at observation, displayed size **32.6 MB**, expiry **never**, no schedule configured. Console prompts plan upgrade for additional/scheduled snapshots.
- Previously user-created branches: `backup-cc-before-007-20261011` and `cc-recovery-drill-20261011`, containing the selected five-table pre-007 baseline; clone/drill comparison five of five counts and MD5 digests matched. **This is subset integrity, not full recovery.**
- Migration 007 and subsequent Contributor position changes were made after creation of the pre-007 safety branch. **Do not assume the day-old snapshot contains migration 007 or current position values.** Confirm snapshot timestamp/schema before using it to recover a specific state.
- Exact project plan, Neon-side branch ancestry/snapshot ID, verified external backup, all 18 table inventories at identical moments, successful full PITR drill and off-provider restore: **unverified**.

## Non-destructive verification (allowed in active Preview)

1. Select `main` explicitly in Neon SQL Editor. Run `db/008_read_only_full_inventory.sql`; record only 18/18 schema flags and counts. Auth session counts can naturally change with logins.
2. Read Backup & Restore: confirm actual remaining window/snapshot entries. **Preview data** may offer read-only historical inspection: use this only for comparisons. **Do not press Restore on main**.
3. If the selected branch has sufficient capacity and the UI allows it, create a **new isolated branch** from `main` at a specific timestamp inside the 6-hour window using Branches > New Branch > Point in time. Use a name such as `cc-pitr-drill-20261011`. **Never attach/move the live main compute or mark a test branch as primary**. Note timestamp and source branch. Use read-only SQL Editor queries on the drill branch to confirm schema, row counts, and selected recorded fingerprints.
4. Restoring an existing snapshot to **a new branch** is a separate optional drill where the console explicitly offers a new-branch target. Before submitting any Restore action, inspect its confirmation and target; if it targets `main` or will switch the application endpoint, cancel. Do not overwrite any existing branch.
5. Independently test an encrypted off-provider `pg_dump` + `pg_restore` into a private isolated PostgreSQL target when operationally feasible. A same-project Neon snapshot or branch is not an off-provider backup. Do not add dumps, accounts, sessions, private data, emails, secrets or credentials to GitHub.

## Acceptable dispositions

- **SNAPSHOT_VISIBLE**: snapshot exists and retention label recorded; not proof it was restored.
- **HISTORY_WINDOW_CONFIRMED**: 6 hours.
- **BRANCH_SELECTED_SUBSET_PASS**: current existing five-table validation.
- **PITR_RESTORE_TO_ISOLATED_BRANCH_PASS**: only after timestamp-specific branch creation and evidence on it.
- **FULL_DB_RESTORE_PASS**: only after all tables (including Better Auth authentication/session and all operational event/audit tables), identity linkage and application behavior are confirmed on a separate restore target.
- **OFF_PROVIDER_RESTORE_PASS**: only after encrypted standalone dump successfully restores in a separate environment.

References (Neon official):
- https://neon.com/blog/three-ways-to-use-your-snapshots
- https://neon.com/blog/practical-guide-to-database-branching
- https://neon.com/blog/point-in-time-recovery
