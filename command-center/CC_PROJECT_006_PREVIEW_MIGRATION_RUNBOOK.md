# CC-PROJECT-LINK-01 — Preview migration 006 runbook

Scope: **Command Center Preview Neon only**, `vyren-command-center`. 
Never run this against the public website database, production, protocol, VDCP or canonical data.
Status: **PREPARED, NOT EXECUTED**. Manual operator must verify each gate before continuing.
Date: 2026-10-11. Governing principle: GNR-STD-001 v1.3 No-Self-Lock / Solution Duty / recoverability.

## Observed actual state

Founder-only `/secure → Projeler → Preview Şema Ön Kontrolü` returned:
- Present: `cc_members`, `cc_tasks`, `cc_project_records`, `cc_workstreams`.
- Missing: `projects`, `events`, `taskLink`, `recordLink`, `projectsWorkstreamFk`, `tasksProjectFk`, `recordsProjectFk`, `eventsProjectFk`.
- Expected source: `db/006_operational_projects_links.sql` (unchanged).
- Missing data is schema only. **No existing data/backfill should be changed**.
- Project build READY is not evidence of an applied database migration.

## Mandatory operator gates

1. Verify in the **Vercel `vyren-command-center` Preview project** which Neon project/database/branch backs its `DATABASE_URL`. Compare via the provider UI, without pasting secrets into chats, logs or source.
2. In the Neon console, verify the exact same project/database/branch is selected. **Do not infer the branch from its name**; the Neon branch attached to Preview may be named `main` within a separate Neon project.
3. Create a recoverable pre-migration branch copy of THAT branch including schema and data, with a descriptive timestamp e.g. `backup/cc-before-006-20261011`. If available, prefer a durable provider snapshot in addition. Verify the copy contains the expected old tables/record counts. Record the **branch name/ID**, retention and how to restore without changing production. Do not delete the backup until tests pass.
4. Record old row counts with the following **read-only** SQL on the Preview-connected original branch (not on a different backup):
```sql
SELECT
 (SELECT COUNT(*) FROM cc_tasks) AS tasks_before,
 (SELECT COUNT(*) FROM cc_project_records) AS records_before,
 (SELECT COUNT(*) FROM cc_project_record_events) AS record_events_before,
 (SELECT COUNT(*) FROM cc_workstreams) AS workstreams_before,
 (SELECT COUNT(*) FROM cc_workstream_events) AS workstream_events_before;
```
5. Optionally test exactly `db/006_operational_projects_links.sql` on a second disposable Neon child branch made from the backup, never on production. Compare schema afterward.
6. In Neon SQL Editor, confirm **target branch selection** is the Vercel-connected Preview branch. Run the exact whole `db/006_operational_projects_links.sql` file once, including `BEGIN;` and `COMMIT;`. A copy-pasted subset is *not* the reviewed migration. If SQL fails, stop; verify transaction rollback and ask for diagnosis rather than rerunning blindly.
7. Immediately repeat the read-only counts in step 4. Every original count must match unless legitimate concurrent new operations occurred (in that case preserve and reconcile timestamps/records).
8. In the **same authenticated fixed Preview branch URL**, open `/secure → Projeler → Preview Şema Ön Kontrolü`. Expected `schemaReady:true`, `missing:[]` and `orphanTaskLinks:0` / `orphanRecordLinks:0`. A preflight PASS does not prove backup or functional test PASS.
9. Founder-only QA in Preview: create an unmistakable QA project (not canonical); link and unlink an existing designated QA task and QA record; verify revision/audit; test archived project and restore, export JSON; then check existing records unchanged and no unintended relation adoption.
10. Contributor QA using a **separate authorized test account**: own-task transitions work; Founder-only project creation/assignment and other Contributor task access are rejected; direct endpoint calls remain secured. Never use real contributors without explicit authorization.
11. Keep live production unchanged; only after all checks should this Preview milestone be marked complete. VDCP integration is a **separate next stage**.

## Recovery and stop rules

- Missing/wrong Neon branch, unverified restoration capability, ambiguous count discrepancy, permission mismatch or non-green schema check = **STOP**.
- Do not issue `DROP TABLE`, `TRUNCATE`, `DELETE`, data backfill or bypass auth as a workaround.
- Rollback/restore should be a conscious, scoped operation. Restoring an entire branch can overwrite unrelated changes made after the backup. Assess those first, and favor a forward corrective migration when safer.
- Neither QA `COMPLETED` nor `DONE` grants VDCP ACCEPTED, treasury transfer, official contract acceptance, Genesis permission or launch PASS.

## Exact source of truth

`command-center/db/006_operational_projects_links.sql` on
`feature/command-center-phase2-auth-db-20261009`.
The GitHub file records code preparation only; it does not run SQL.
