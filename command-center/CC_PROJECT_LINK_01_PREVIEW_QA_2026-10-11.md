# CC-PROJECT-LINK-01 — Preview live QA evidence

Date: 2026-10-11 (Europe/Istanbul)
Scope: VYREN Command Center operational Preview only.
Authority: OPERATIONAL_ONLY; no canonical VDCP, lifecycle, FFA, economics, governance or launch-state acceptance.

## Evidence scope and provenance
Evidence is the Founder's live Preview UI checks and the user-supplied export `vyren-command-center-projects-2026-10-11.json` inspected in the conversation. This is **observed user-reported QA evidence**, not an independent penetration test or database forensic audit. The private JSON is **not** committed to this repository.

## Migration 006
- Before: schema preflight `missing`: `projects, events, taskLink, recordLink, projectsWorkstreamFk, tasksProjectFk, recordsProjectFk, eventsProjectFk`.
- Founder reports executing `db/006_operational_projects_links.sql` against the selected Command Center Neon Preview branch.
- After at 2026-10-11 15:51:15 local: preflight `schemaReady:true`, missing none, counts all zero, orphan links zero.
- Schema verification: **PASS**. Backup existence/retention/restore test: **UNVERIFIED**; preflight explicitly says this cannot be checked by it.
- Original pre/post row-count comparison from SQL Editor: **NOT EVIDENCED**.

## Operational project tests — PASS
- Create `CC-QA-006` project: revision 1, status IN_PROGRESS.
- Update project title to remove stray word `Kopyala`: revision 2, original snapshot retained.
- Task relation: 1 linked; status of task unchanged (BRIEFED).
- Project status record relation: 1 linked; record status unchanged (IN_PROGRESS).
- Project drilldown displayed exactly 1 task and 1 record.
- History `CREATE(1), UPDATE(2)` displayed.
- Project JSON export: `VYREN_CC_OPERATIONAL_PROJECT_LINKS_V1`; project=1, project events=2, taskLinks=1, recordLinks=1; event/project IDs/revisions agree; the export contained both revision snapshots. The full private data is not committed.
- Archive: project revision 3, original task/record relationships preserved.
- Restore: project revision 4, original task/record relationships preserved; `RESTORE(4), ARCHIVE(3), UPDATE(2), CREATE(1)` displayed.
- Unlink task and record: project displays 0 task and 0 records, project revision stays 4. Founder then verified both source items still appear in their own modules.
- QA project currently restored/active; not an accepted canonical project or an active launch work item.

## Contributor authorization tests — PASS (real account)
Founder supplied result from Contributor's own Preview interface:
- Role/read/mutation security checks: **8 PASS / 0 FAIL / 0 INCONCLUSIVE**. Included active task scope: 1 returned task belonged to authenticated Contributor.
- Other-Contributor ownership checks: **3 PASS / 0 FAIL / 0 INCONCLUSIVE**; accept/start/submit each blocked with HTTP 403; read-only authorization check.
- `GET /api/cc/projects`: `{"error":"Yalnızca Kurucu erişebilir"}`; consistent with Founder-only API 403, though the pasted text does not include separate HTTP status.
- These are bounded role/ownership regression checks, **not** complete independent security or penetration testing.

## Milestone disposition
- `CC-PROJECT-LINK-01` **FUNCTIONAL_QA_PASS** in Preview on 2026-10-11.
- **NOT** a production release, launch PASS, canonical decision modification or VDCP work package acceptance.
- Open safeguards:
  1. Confirm a recoverable Neon Preview branch backup, retention and restore mechanism for migration 006. Do not claim done until verified.
  2. Verify any desired independent security and full DB recovery tests separately.
  3. Archive retained QA project if Founder wants clean operational views; do not delete history or mutate the existing isolation QA task.
- Next development workstream: make responsible Contributor name prominent on task cards, add optional Owner filter to Founder active tasks; then separately scope VDCP integration using current canonical controls. No automatic VDCP state changes from task/project states.


## Post-maintenance Preview regression — 2026-10-11

- Deployment: branch `feature/command-center-phase2-auth-db-20261009`, commit `6bfcf3e35cdd44b7e846dac660bc022a147912a9`; Vercel reported READY and stable alias pointed to that deployment.
- Founder `/secure → Projects → Preview Schema Preflight` observed at 2026-10-11 16:53:58 Europe/Istanbul:
  - `schemaReady=true`; projects=1, projectEvents=4, linkedTasks=0, linkedRecords=0, orphanTaskLinks=0, orphanRecordLinks=0.
  - Explicit UI caveat: backup not verified, migration not performed by check, live user tests separate.
- Contributor regression on new Preview: 8 PASS / 0 FAIL / 0 INCONCLUSIVE for Founder operation/reads and own-active-task scope; 3 PASS / 0 FAIL / 0 INCONCLUSIVE for other Contributor ownership guards.
- Founder uploaded regenerated private project JSON export stamped `2026-10-11T13:55:16.225Z`. Offline structure validation: `projects=1,events=4,taskLinks=0,recordLinks=0` matches array lengths; four event revisions contiguous 1→4 and all events reference same project; latest RESTORE snapshot matches project title and revision; project unarchived. JSON contents withheld from Git.
- Result: **PREVIEW POST-MAINTENANCE REGRESSION PASS** for observed schema, role/ownership and project export structure.
- Limit: This is not an exhaustive penetration test; it does not verify original user/member records or a recoverable Neon backup. It does not independently inspect DB TLS handshake. Tests of all modules and separate disaster recovery remain open.
- Next incomplete execution point: branch backup of Preview-connected Neon database, verify isolated copy matches original counters, verify retention/recovery method, then consider migration 007 only with proven safeguard.


## Backup branch fingerprint parity (user-supplied) — 2026-10-11

Two separately pasted SELECT-result blocks have **identical MD5 digest values** for these five tables:
`cc_members`, `cc_tasks`, `cc_project_records`, `cc_projects`, `cc_project_events`.
Earlier five-table counts from two runs were likewise identical: `3 / 5 / 5 / 1 / 4`.

**Disposition: 5/5 fingerprints MATCH; BACKUP_INTEGRITY_SUBSET_PASS conditional on confirming that the two executions selected source `main` and `backup-cc-before-007-20261011` separately.** The pasted SQL results do not contain Neon branch IDs, so the branch selections themselves are not independently evidenced in this record.

This verifies parity of the five selected tables at the time of their respective reads; it does **not** establish independent offsite backup, full PostgreSQL database restoration, retention policy, complete auth/audit/deliverables history parity, or migration 007 execution.

Next: perform a **non-destructive recovery drill** by creating a separate test branch from the preserved backup branch (or restoring a Neon snapshot into a new branch if enabled), verify schema and data against captured baseline, and record source/target branch names. Never restore/overwrite `main` as part of QA.


## Isolated recovery drill — 2026-10-11 (user-operated Neon SQL Editor)

- The user reports creating Neon branch `cc-recovery-drill-20261011` and executing a read-only check there. Five required tables returned true: `cc_members`, `cc_tasks`, `cc_project_records`, `cc_projects`, `cc_project_events`.
- A second read-only combined count + JSONB/MD5 query on the drill branch returned:
  | Table | Count | MD5 |
  |---|---:|---|
  | cc_members | 3 | 446b993bad5f887f4d05fe346c49a192 |
  | cc_tasks | 5 | bfa49ff8e972c38accd575adadcb3070 |
  | cc_project_records | 5 | 28b3d541c0c9d925f739e7c3bd5a6d25 |
  | cc_projects | 1 | a2ea9cf289f940cf3b8837657afbab9d |
  | cc_project_events | 4 | c2e64dca8b5eef41fd0015b930f5d152 |
- **RECOVERY_BRANCH_SELECTED_DATA_PASS (reported)**: all 5 table counts and digests match the prior baseline; the branch is queryable with expected schema. The outcome is based on user-observed branch selection and returned results. No independently fetched Neon branch lineage/ID was provided.
- **Still not FULL_DB_RESTORE_PASS**: no restore to a point in time was conducted; other auth, history and operational tables, retention, and offsite recovery were not independently tested. No source/main branch was reset. `007_contributor_position_titles.sql` is not yet evidenced as applied.
- Next: apply migration 007 only to the intended active Preview database branch after confirming the source branch in Neon; preserve the backup and drill branches, run the post-migration schema query and re-check counts, then test Founder position editing and regression.


## Migration 007 + Founder position/workload UI acceptance — 2026-10-11

- User executed `007_contributor_position_titles.sql` on the Command Center Preview-connected Neon `main` branch (user-reported). Read-only SQL verification returned `position_ready=t`, `constraint_ready=t`, `index_ready=t`.
- Unchanged baseline table counts: `cc_members=3`, `cc_tasks=5`, `cc_project_records=5`, `cc_projects=1`, `cc_project_events=4`.
- Founder Team UI presented editable "Organizasyon pozisyonu" fields; user saved and displayed:
  - `VYREN Test Contributor` → `Kalite Güvence ve Test Sorumlusu`;
  - `Nothingness Online` → `Topluluk ve İletişim Sorumlusu`.
- Founder "Görev Dağılımı" UI grouped exactly one Contributor and one non-archived task per position; selected task list displayed `CC-ISOLATION-001 Kopyala` owned by VYREN Test Contributor and `CC-ISOLATION-002` owned by Nothingness Online, both `Tanımlandı`. User-reported aggregate: two tasks / one page.
- **MIGRATION_007_SCHEMA_PASS**; **POSITION_SAVE_AND_DISPLAY_PASS**; **FOUNDER_ASSIGNMENT_GROUPING_PASS** on submitted results.
- Nuance: 5 total database task rows vs 2 shown by report need not differ incorrectly; UI groups active/non-archived Contributor assignments. Archived/unassigned/other-owner distribution not independently inspected.
- Remaining scope: independent Neon retention and full-database restore assurance; additional live regression across opportunities/workstreams/invitations; independent security assessment. No transfer of governance/canonical lifecycle authority from the operational position field.


## Founder module health structural scan — 2026-10-11

- User ran the new Founder-only, read-only **Modül Sağlık Kontrolü** at 2026-10-11 17:33:57 Europe/Istanbul on the Command Center Preview application.
- Schema: `workstreams=ready`, `opportunities=ready`, `invites=ready`, `position=ready`.
- Counts: `cc_workstreams=1`, `cc_workstream_events=3`; `cc_opportunities=1`, `cc_opportunity_events=4`; `cc_team_invites=1` (`pending=0`, `active=1`, `revoked=0`).
- Integrity checks: duplicate workstream revisions=0, duplicate opportunity revisions=0, orphan workstream events=0, orphan opportunity events=0, mismatched invite identity link pairs=0.
- **MODULE_HEALTH_STRUCTURAL_PASS**. The scan exposes counts and integrity flags only and does not alter records.
- Not yet proven by this scan: actual CREATE/UPDATE/ARCHIVE/RESTORE transition correctness, chronological event continuity and snapshot agreement, newly extended Contributor forbidden-route checks, credential-offboarding, or a full DB restore.
- Next: compare read-only event-action/revision sequences, then extend Contributor-only safe 403 regression checks for workstreams, opportunities, team, and module health; preserve existing records and identity bindings.


## Workstream/opportunity history acceptance and Contributor isolation follow-up — 2026-10-11

User-observed Founder histories from the Preview:
- **Workstream**, reverse chronological: RESTORE revision 3 ACTIVE (2026-10-10 22:54:09), ARCHIVE revision 2 ARCHIVED (22:52:09), ADOPT revision 1 ACTIVE (22:50:59). Chronological actions ADOPT → ARCHIVE → RESTORE and consecutive revisions 1–3. **WORKSTREAM_EVENT_SEQUENCE_PASS**.
- **Opportunity**, reverse chronological: RESTORE revision 4 QUALIFIED (2026-10-10 23:11:46), ARCHIVE revision 3 QUALIFIED (23:10:46), UPDATE revision 2 QUALIFIED (23:09:28), CREATE revision 1 RESEARCH (23:08:09). Chronological actions CREATE → UPDATE → ARCHIVE → RESTORE and consecutive revisions 1–4. **OPPORTUNITY_EVENT_SEQUENCE_PASS**.
- These checks validate presented event actions, revision sequences, and displayed states; they are not independent full snapshot-by-snapshot database equivalence checks.
- The Contributor `Yetki Güvenliği Testi` UI is extended with four new **read-only GET** checks (workstreams, opportunities, team invites/members, module-health endpoint), requiring HTTP 403 / "Yalnızca Kurucu erişebilir". No mutation or offboarding is attempted. **PENDING live Contributor 4/4 result** until a Contributor performs the test on the ready Preview.
- No existing assignments, invitations, workstream/opportunity records, or Neon branches were altered by these changes.


## Contributor security regression — 15/15 PASS (user-observed, 2026-10-11)

User ran three controls under a VYREN Test Contributor session in the current Command Center Preview.

| Group | PASS | FAIL | INCONCLUSIVE | Scope |
|---|---:|---:|---:|---|
| Existing Founder-only action/read authorization and own active-task scope | 8 | 0 | 0 | Audit/archive GET, denied create/approve/revise/archive/restore, active task owned by the current Contributor (1 task) |
| Newly added Founder module GET isolation | 4 | 0 | 0 | `/api/cc/workstreams`, `/api/cc/opportunities`, `/api/cc/team`, `/api/cc/module-health`, each HTTP 403 |
| Cross-Contributor ownership checks | 3 | 0 | 0 | Denied ownership-test accept/start/submit, HTTP 403 using the same server ownership guard; no actual task mutations |

**CONTRIBUTOR_AUTHORIZATION_REGRESSION_PASS: 15 PASS / 0 FAIL / 0 INCONCLUSIVE.** Reported server errors were the expected HTTP 403, including Founder-only module reads and the other-Contributor ownership guard. No assignments, invites, records, or project data were changed by the checks.

Limits: negative-path, test-session evidence only; not independent penetration testing, exhaustive role/cookie tests, newly invited Google user lifecycle/revocation test, all real mutation transitions, or full-database recovery. Preserve approved Contributor access and current isolation-test tasks. Next incomplete gate: review live invitation/revocation flows with a controlled, separate test identity (no existing user lockout) and verify operational launch readiness; separately track full Neon backup/restore/retention assurance.


## New Contributor invitation lifecycle preparation — 2026-10-11

- Reviewed current `cc_team_invites` state machine, `getActor()` Google account identity binding and `/api/cc/team` Founder-only operations, without altering live invitations or members.
- Fixed **login presentation dependency**: Google sign-in now displays when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured; no longer requires legacy `TEST_GOOGLE_EMAIL`. The specific test-account bypass remains separate from invitation authorization. A newly invited verified Google identity still requires matching `PENDING` invitation and gets linked to Google provider account ID + Better Auth member ID.
- UI now correctly notes that Google Cloud OAuth Test users enrollment is needed **only while the OAuth consent app remains in Testing**, and that Command Center stores invitation grants but does not send invitation email.
- Files modified: `app/secure/page.tsx`, `app/secure/sign-in.tsx`, `app/secure/team-panel.tsx`. No database migration.
- **INVITE_LIFECYCLE_E2E = PENDING**: requires a distinct, controlled Google test identity, explicit Founder-issued test invite and verified login; later revocation, session invalidation and reactivation must be observed. Existing Contributor accounts and test assignments must not be used for lifecycle destructive QA. Do not claim test PASS from code review.


## Invitation E2E deferred without third Google test identity — 2026-10-11

- Founder states there is no third Google/Gmail account available for an independent invitation-to-first-login test.
- **INVITATION_LIFECYCLE_LIVE_E2E = DEFERRED_UNVERIFIED**, not PASS or failed. Do not create a new identity solely as an artificial launch dependency.
- Existing two Contributor accounts, their active access, assignments and sessions must not be revoked as a shortcut to this test. They remain in use. Do not treat synthetic SQL/branch simulations as evidence of a real provider OAuth flow.
- Existing evidence remains unchanged: Contributor authorization regression 15/15 PASS; workstream and opportunity history sequence PASS; module health structural PASS; migration 007 and position assignment PASS.
- No-self-lock execution disposition: continuation of non-identity work is permitted, while independent fresh-user invitation and revoke/re-authentication tests remain a **release-readiness assurance gap** to complete before onboarding external Contributors at scale. Do not claim general production identity lifecycle assurance.
- Next work can cover backup retention/full DB recovery, user experience, and operational reporting, without touching live identities or canonical VYREN governance.


## Database recovery readiness inventory — 2026-10-11

- Existing independent Neon branch drill and five-table hash parity remain **PASS with bounded scope**; full database PITR restore or external `pg_dump` restore remains **NOT VERIFIED**.
- Added `db/008_read_only_full_inventory.sql` as a documentation/SELECT-only verification script covering all 18 declared Better Auth + Command Center tables, including sessions, accounts, audit, invites and historic event tables. **008 is NOT a migration**; no schema changes should be applied for this stage.
- Updated stale `README.md` that previously described only localStorage demo, now accurately describing current authenticated Preview and remaining launch assurance gaps.
- Next operator actions: review Neon Console **Backup/Restore → restore window and snapshot options** for the actual project and plan; choose **isolated new branch**, never `main`, for any point-in-time restore drill. Execute inventory script on the explicitly selected branch, and compare its values with an inventory captured at the same recovery timestamp. Verify retention and recovery rights from actual account state.
- Out-of-provider independent encrypted `pg_dump` / isolated `pg_restore` is an **additional resilience task**, not satisfied by same-project Neon branches.
- No changes to existing user identities, member sessions, project records or live Neon branch settings.


## Main branch all-18-table read-only inventory — 2026-10-11

User executed `db/008_read_only_full_inventory.sql` with Neon SQL Editor on `main` (user-reported branch) and supplied:

- Schema: `expected_tables=18`, `present_tables=18`, `missing_tables={}`. **FULL_SCHEMA_INVENTORY_PASS**.
- Counts: `user=4`, `session=5`, `account=4`, `verification=0`, `cc_members=3`, `cc_tasks=5`, `cc_deliverables=5`, `cc_reviews=5`, `cc_audit=59`, `cc_team_invites=1`, `cc_project_records=5`, `cc_project_record_events=13`, `cc_workstreams=1`, `cc_workstream_events=3`, `cc_opportunities=1`, `cc_opportunity_events=4`, `cc_projects=1`, `cc_project_events=4`. Total **123 rows** across 18 tables at query time.
- Better Auth auth/session/account data was counted but **never exported or shared**.
- These are read-only presence/count results; no complete-table hash equality, relational consistency across all foreign keys, dump integrity, point-in-time recovery, or isolated 18-table restore is yet evidenced.
- Existing isolated backup-branch subset validation remains distinct and cannot be automatically credited as verification of all 18 tables.
- **Next incomplete execution point:** create a new isolated point-in-time branch from `main` at a known recent timestamp within the currently visible 6-hour history window (if the plan permits), without restoring/rewinding `main`; run the same full inventory on that target and compare timestamp-aware counts. Document source branch, exact restore timestamp and target branch. Recognize that a sample taken later on `main` can differ in sessions/audit. New snapshot slots/retention require no upgrade for this test.


## Isolated PITR branch 18-table schema and count parity — 2026-10-11

- Founder reports creating isolated Neon PITR branch `cc-pitr-drill-20261011` from `main` (intended point in time was 2026-10-11 18:15 Europe/Istanbul, but final UI-confirmed branch source timestamp/ancestry not independently captured).
- User executed read-only `db/008_read_only_full_inventory.sql` on selected PITR branch and supplied `expected_tables=18`, `present_tables=18`, `missing_tables={}`.
- All 18 counts matched the earlier `main` sample exactly: `user=4`, `session=5`, `account=4`, `verification=0`, `cc_members=3`, `cc_tasks=5`, `cc_deliverables=5`, `cc_reviews=5`, `cc_audit=59`, `cc_team_invites=1`, `cc_project_records=5`, `cc_project_record_events=13`, `cc_workstreams=1`, `cc_workstream_events=3`, `cc_opportunities=1`, `cc_opportunity_events=4`, `cc_projects=1`, `cc_project_events=4`; sum 123.
- **PITR_SCHEMA_AND_COUNT_PARITY_PASS (user-reported)**. Not yet evidence of row-content parity, verified timestamp/lineage, authenticated application runtime or full recovery. No modification to `main` performed.
- Added `db/VERIFY_18_TABLE_CONTENT_FINGERPRINTS_READ_ONLY.sql`, a separate SELECT-only deterministic whole-row fingerprint query for these 18 current small tables. Execute on each branch and compare matching timestamps with care: live auth sessions/audit may change. No individual auth/account/session values or private data should be posted.


## Isolated PITR all-18-table content fingerprint parity — 2026-10-11

- Founder supplied two query result sets from `db/VERIFY_18_TABLE_CONTENT_FINGERPRINTS_READ_ONLY.sql`, run per the instructed sequence on the isolated `cc-pitr-drill-20261011` and active `main` Neon branches (branch selection is user-reported; output tables have no branch identifier).
- The two result sets have exactly **18 matching table names, 18/18 matching row counts, and 18/18 matching content fingerprints**, with 0 differing results. The 18 counts remain `4,5,4,0,3,5,5,5,59,1,5,13,1,3,1,4,1,4` in the baseline inventory table order, totaling **123 rows**.
- Scope includes Better Auth `user`, `session`, `account`, `verification`; operational `cc_members`, `cc_tasks`, deliverables/reviews, audit, invites, project records/events, workstreams/events, opportunities/events, projects/events.
- **PITR_CONTENT_FINGERPRINT_PARITY_PASS (user-observed)**. No table row content, sensitive account/session records, or raw credentials were copied into this QA record; only comparison outcome recorded.
- This establishes deterministic fingerprint parity of all known rows/columns returned by the current SQL on the two selected branches, not independent verification of actual Neon source lineage or chosen PITR timestamp, data durability outside Neon, full-schema object (function/index/extension/privilege) equivalence, running app ability to connect and authenticate on an isolated restore, or off-provider backup-and-restore.
- **PITR_DB_SELECTED_DATA_PARITY_PASS** is appropriate at the database row-content level; **FULL_DB_RESTORE_PASS and PRODUCTION_RECOVERY_READY remain UNVERIFIED**.
- Next safe step: read only the isolated branch's Neon Console metadata (parent/source `main`, creation method/history timestamp and branch name); do not use Restore on `main`, change Vercel production environment variables, or publish DB connection strings. Independent app-level smoke and encrypted off-provider backup may be addressed separately without blocking unrelated operational development.


## PITR drill branch lineage metadata — 2026-10-11

User provided Neon Console "Branch overview" fields for isolated `cc-pitr-drill-20261011`:
- Neon branch ID: `br-purple-mountain-b21do714`.
- Parent branch: `main`.
- Branch created: `2026-10-11 18:24:37` (user console display; timezone presumed Europe/Istanbul based on surrounding UI).
- Last updated: `2026-10-11 18:30:44`. Expiry: `Never`. Console shows 1 database and 1 compute.
- `LSN` section displays `Reset from parent`, but this excerpt **does not present an explicit parent timestamp, origin LSN or creation method "Time" vs "Head"**. The previously intended timestamp `18:15 Europe/Istanbul` remains **unconfirmed as historical branch point**.
- **PARENT_MAIN_CONFIRMED** (user-observed metadata). Existing `PITR_SCHEMA_AND_COUNT_PARITY_PASS` and `PITR_CONTENT_FINGERPRINT_PARITY_PASS` remain valid for the user-reported selected branch pair. **HISTORICAL_POINT_AT_18_15_UNVERIFIED**. Identical hashes alone do not discriminate current-time branching from earlier-time branching if no intervening writes happened.
- Next: preserve independent drill branch; do not click a restore/reset control on `main` and do not infer an exact PITR target timestamp. Current safe operational Preview work need not pause for an artificial DB mutation; full app-on-restored-branch smoke, time-travel provenance and external encrypted backup can remain separately tracked recovery assurance.


## Complete Neon branch inventory — 2026-10-11

User provided the Neon Console Branches view showing **6 branches**, one active `main` and five branches with idle compute:
- `main` — Default, Active, displayed storage approximately 33.55 MB.
- `backup-cc-before-007-20261011` — Parent `main`, Idle. Earlier 5-table pre-migration snapshot and recovery drill reference.
- `cc-recovery-drill-20261011` — Parent `backup-cc-before-007-20261011`, Idle. Selected 5-table count/hash parity previously verified.
- `cc-pitr-drill-20261011` — Parent `main`, Idle. All 18-table schema/count/fingerprint parity previously observed, but exact historical branch point still unverified.
- `vyren-recovery-test-20261010` — Parent `main`, Idle. Independent earlier test branch, detailed restoration semantics not evidenced.
- `branch_from_snapshot_Oct 10, 2026 2:54 PM GMT+3` — Parent shown as `-`, Idle, displayed storage about 32.65 MB. **Likely snapshot-origin by name**, but the exact snapshot ID, restored contents and relationship to active `main` are **not independently verified**. It is a branch in addition to the snapshot inventory item, not proof of complete snapshot recovery.

**Disposition:** BRANCH_INVENTORY_SIX_RECORDED, NO_MAIN_RESET, EXISTING_BACKUPS_RETAINED. A snapshot-named branch is **available for non-destructive assessment without consuming another branch slot**. If testing it, select that branch in Neon SQL Editor and run `db/008_read_only_full_inventory.sql`. Compare historical data cautiously; migration 007/position metadata may postdate the Oct 10 snapshot. Do not delete branches or overwrite `main` as an unrequested cleanup. Off-provider backup and isolated application smoke testing remain open.


## Snapshot-derived historical branch schema check — 2026-10-11

- Founder selected Neon branch `branch_from_snapshot_Oct 10, 2026 2:54 PM GMT+3` and ran the **schema presence portion** of `db/008_read_only_full_inventory.sql`.
- Returned `expected_tables=18`, `present_tables=10`, `missing_tables={cc_opportunities,cc_opportunity_events,cc_project_events,cc_project_record_events,cc_project_records,cc_projects,cc_workstream_events,cc_workstreams}`.
- Those eight missing tables belong to later operational-module migrations 003–006; absence is consistent with an earlier schema snapshot, **not evidence of physical corruption**. Exact source snapshot metadata and historical contents are not independently verified from this result.
- **HISTORICAL_SNAPSHOT_SCHEMA_10_OF_18_CONFIRMED**, **CURRENT_FULL_SCHEMA_RESTORE_FROM_THIS_SNAPSHOT_NOT_SUITABLE**. It must not be used to replace present `main`. Separate PITR drill of 18/18 tables remains PASS by counts and fingerprints.
- The full 18-table inventory file's second SELECT statement references missing tables and **will error if run on this historical branch**. No need to rerun this known-incompatible query.
- Snapshot age/fidelity and restricted capacity mean this snapshot is a historical checkpoint, not sufficient as the sole up-to-date backup. The currently live six-hour history window also cannot substitute for durable off-provider encrypted backup.
- **No database changes made.** Keep `main`, snapshot branch, older backup and recovery-drill branches unmodified. Next operational resilience task: independent current encrypted backup and isolated restore when an authorized secure target is available; existing proof does not justify claiming `FULL_DB_RESTORE_PASS`.


## Recovered prior WSL encrypted backup evidence — 2026-10-10

**Correction / supersession of earlier statements that off-provider backup was not yet created:**

- Earlier dated VYREN Command Center WSL user-run evidence confirms an **existing local encrypted PostgreSQL backup** from 2026-10-10: filename `VYREN_CC_main_20261010_160111.dump.gpg`, saved under user's WSL private `vyren_secure_backups` directory; observed size approximately **12 KB**; outcome `BACKUP_CREATED`.
- User also executed GPG decryption piped into `pg_restore --file=/dev/null`, with successful `BACKUP_READ_OK` result. This validates decryption / backup archive readability but **does not perform a real database restore**, and the 12 KB size is not evidence of current completeness.
- User-reported 2026-10-10 `main` vs `vyren-recovery-test-20261010` comparison showed **8/8 selected table-content hashes MATCH**, 56 rows in that historical sample. This is a **separate branch data parity check**, not proof that the encrypted WSL dump was restored into that branch.
- The older Neon snapshot-derived branch `branch_from_snapshot_Oct 10, 2026 2:54 PM GMT+3` is from that period; today's 10/18 schema result is consistent with later operational migrations, not a consequence of the WSL dump. Snapshot origin and dump origin are distinct recovery mechanisms.
- **Disposition: LOCAL_ENCRYPTED_PG_BACKUP_CREATED_PASS; GPG_DUMP_READABILITY_PASS; ENCRYPTED_DUMP_REAL_RESTORE_PENDING; CURRENT_18_TABLE_ENCRYPTED_BACKUP_PENDING.** Not `OFFSITE_BACKUP_PASS`, since off-device storage is not evidenced. Do not erase, commit or transmit encrypted/unencrypted dump, connection strings or credentials.
- This section controls over prior statements suggesting an independent encrypted backup had not been created at all. Existing Neon 18/18 isolated branch content fingerprint parity remains independently PASS, and `FULL_DB_RESTORE_PASS` remains unverified.


## October 11 daily encrypted WSL backup — user-run

- User manually ran the **existing** installed WSL script `/home/oms29/.local/bin/vyren-cc-backup.sh` (not a new GitHub-generated backup implementation); terminal reported `DAILY_ENCRYPTED_BACKUP_CREATED`.
- The script emitted a new, private encrypted archive under the user's WSL `vyren_secure_backups/daily/` directory: `VYREN_CC_daily_20261011_185618_539761457.dump.gpg`. Displayed size **25K**, Unix mode **-rw------- (0600)**, mtime 2026-10-11 18:56 local.
- **CURRENT_DAILY_ENCRYPTED_BACKUP_FILE_CREATED_PASS (user-observed)**. The output alone does not independently establish 18-table TOC completeness, consistent restore, off-device retention, recoverability of the GPG key, or full database recovery.
- The original daily backup mechanism remains preferred; avoid competing owner-password or parallel GPG encryption flow. The repo's auxiliary `scripts/wsl_neon_main_encrypted_backup.sh` was changed to delegate to the user's existing engine rather than reimplement it.
- Next: locally inspect this private file with GPG decrypt streamed to `pg_restore --list` and compare the expected 18 table data entries; do not print raw rows, plaintext dump, private keys or connection secrets, and do not alter `main`. Then verify full restore into an isolated PostgreSQL target separately.


## October 11 WSL encrypted archive table of contents — 19 entries

- Founder ran GPG decryption piped into `pg_restore --list`, counting `TABLE DATA public` entries in the local encrypted daily archive `VYREN_CC_daily_20261011_185618_539761457.dump.gpg`, with `pipefail`. The archive contained **19 TABLE DATA entries**.
- Founder provided the following TOC table names, sorted: `account`, `cc_audit`, `cc_deliverables`, `cc_members`, `cc_opportunities`, `cc_opportunity_events`, `cc_project_events`, `cc_project_record_events`, `cc_project_records`, `cc_projects`, `cc_reviews`, `cc_tasks`, `cc_team_invites`, `cc_workstream_events`, `cc_workstreams`, `playing_with_neon`, `session`, `user`, `verification`.
- **BACKUP_ALL_18_REQUIRED_TABLE_DATA_TOC_PASS**: all 18 expected Better Auth / Command Center tables appear as TABLE DATA entries. Extra `playing_with_neon` appears in addition and is not one of the 18 required tables.
- **GPG_ARCHIVE_TOC_READ_PASS**: local decryption / PostgreSQL archive table-of-contents listing worked; archive is 25 KB by user output and stored mode 0600.
- TOC presence is **not** a real data restore, proven row-count/content equivalence, PostgreSQL role/extension compatibility, or assurance that the exact current state can be recovered. `FULL_DB_RESTORE_PASS` is pending.
- Next: inspect whether a fully isolated WSL/local PostgreSQL server is available, then perform a reversible test database restore without connecting to or mutating Neon `main`; keep archive encrypted at rest, no secret or raw data exports in GitHub.


## Independent local PostgreSQL 18 real encrypted archive restore — 2026-10-11

User installed PostgreSQL 18 server inside WSL Ubuntu; observed local `pg_lsclusters` output `18 main 5432 online postgres /var/lib/postgresql/18/main`. This is **local cluster `main`**, not Neon production `main`.

Founder executed GPG stream decryption of the encrypted daily WSL backup `VYREN_CC_daily_20261011_185618_539761457.dump.gpg` piped into the locally addressed server:
`sudo -u postgres pg_restore -h /var/run/postgresql -p 5432 -d vyren_cc_restore_20261011 --no-owner --no-privileges --single-transaction --exit-on-error` with Bash `set -o pipefail`.
The terminal reported the GPG recipient fingerprint summary for RSA key `A6AC9153FA18269E` and `RESTORE_EXIT_CODE=0`. No authentication secrets or raw archive contents were sent to the repository.

**LOCAL_ENCRYPTED_ARCHIVE_RESTORE_EXECUTION_PASS (user-observed)**: a real `pg_restore` completed successfully into an isolated LOCAL PostgreSQL database, independent of Neon. This supersedes older `ENCRYPTED_DUMP_REAL_RESTORE_PENDING` language FOR THIS ARCHIVE. No Neon live target/connection was supplied to the restoration command.

**Still to confirm**: 18 required restored tables present and row-content fingerprints of the newly restored data; TOC showed 19 TABLE DATA entries, including extra `playing_with_neon`. For parity, sample counts and deterministic whole-row fingerprints against known source point (not blindly against earlier source due to time drift). Production runtime restoration/app authentication and separately stored off-device backup remain distinct tasks.

**Do not** drop local restore database until test evidence has been captured or overwrite the encrypted archive. Never operate on Neon `main`.


## Local off-provider restore table-presence PASS — 2026-10-11

- After successful GPG-streamed local PostgreSQL 18 `pg_restore` (exit 0), founder ran `sudo -u postgres psql -h /var/run/postgresql -d vyren_cc_restore_20261011 -Atc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"`.
- Returned `19` local `public` base tables. Encrypted backup TOC also held 19 TABLE DATA entries: all 18 required Better Auth + Command Center tables and the extra `playing_with_neon` table.
- **LOCAL_RESTORE_TABLE_PRESENCE_19_PASS (user observed)** and **LOCAL_ENCRYPTED_ARCHIVE_RESTORE_EXECUTION_PASS** remain established. This is an independent WSL PostgreSQL target; Neon `main` was not selected or modified by restore.
- Still unverified: per-table restored row counts/fingerprints against the backup-time source baseline, FK/application behavior, remote off-device copy of encrypted archive, and isolated cloud application recovery. Next control: non-mutating local PostgreSQL per-table row-count query.


## WSL independent encrypted restore 19-table row-count parity — 2026-10-11

Founder ran a read-only local PostgreSQL 18 count inventory against `vyren_cc_restore_20261011` (restored from 2026-10-11 18:56 GPG archive). It returned **19 public tables**, including `playing_with_neon=10`; the other **18 required Command Center/Better Auth table counts exactly match the earlier 2026-10-11 Neon main / PITR sample**:
`account=4, cc_audit=59, cc_deliverables=5, cc_members=3, cc_opportunities=1, cc_opportunity_events=4, cc_project_events=4, cc_project_record_events=13, cc_project_records=5, cc_projects=1, cc_reviews=5, cc_tasks=5, cc_team_invites=1, cc_workstream_events=3, cc_workstreams=1, session=5, user=4, verification=0`.

**Counts:** 123 required-table rows, plus 10 rows in `playing_with_neon` = 133 restored rows across 19 tables.
**LOCAL_OFF_PROVIDER_PG_RESTORE_EXECUTION_PASS; RESTORED_SCHEMA_19_TABLES_PASS; RESTORED_18_REQUIRED_TABLE_COUNT_PARITY_PASS** (user-observed).
- Unlike the earlier archive readability test, this tested real `pg_restore` into a separate local PostgreSQL database, with `RESTORE_EXIT_CODE=0`.
- This does not establish exact restored full-row content parity, backup-time transactional identity vs earlier Neon sampling, application auth/runtime readiness, durable off-device storage, or complete production DR posture. Those are separate.
- Next: run SELECT-only deterministic `to_jsonb(t)` aggregate fingerprints for all 18 required restored tables; compare to previously recorded Neon `main` fingerprints from the same general timeframe, noting legitimate changes if source sample predates backup.
- No mutation to Neon main; preserve encrypted backup and local restored test DB pending verification.


## WSL UTC normalization resolves first restored-table digest mismatch

- On 2026-10-11, the WSL PostgreSQL 18.6 restored database reported session TimeZone `Europe/Istanbul`.
- User executed session-only `SET TIME ZONE 'UTC'` and reran the deterministic MD5 check on `public.user`.
- The resulting four-row digest exactly matched the earlier Neon baseline (`2d8eb8bfbffdb3d17cc2fcce827ceaa2`), unlike its pre-normalization digest.
- **USER_TABLE_CONTENT_FINGERPRINT_PARITY_PASS_AFTER_UTC**. This confirms timezone-dependent JSONB timestamp rendering caused at least the observed difference on that table. It does not yet confirm the other 17 tables; full 18-table rerun with UTC remains next.
- Restore into independent local PostgreSQL, 19 tables (18 expected plus an auxiliary table), and required-table row counts remain PASS. The source Neon database and encrypted archive are unchanged.


## WSL encrypted 18-table off-provider restore content parity PASS — 2026-10-11

User-reported FINAL local PostgreSQL recovery evidence on `vyren_cc_restore_20261011`:

- A fresh 2026-10-11 18:56 daily WSL GPG recipient-encrypted backup was created with the pre-existing backup workflow and safely retained at rest.
- `gpg --decrypt` streamed the custom PostgreSQL archive into `sudo -u postgres pg_restore` on independent LOCAL PostgreSQL 18, with `--no-owner --no-privileges --single-transaction --exit-on-error`. Terminal returned **RESTORE_EXIT_CODE=0**. No Neon `main` destination was involved.
- Backup TOC and restored local schema include **19 public TABLE DATA/table entries**: **all 18 required Command Center/Better Auth tables** plus auxiliary `playing_with_neon` with 10 rows.
- Required restored table row counts **18/18 match** the earlier Neon `main` baseline (**123 rows**). Auxiliary 10 rows yield **133 rows** across 19 public tables.
- The original local check using `to_jsonb(t)::text` had 17 mismatching nonempty-table MD5s with local `TimeZone=Europe/Istanbul`. User executed **`SET TIME ZONE 'UTC';`** in the local test session; on re-running the full 18-table SELECT-only content fingerprint verification query, **all 18 row counts and all 18 digests matched exactly** the earlier Neon main and isolated PITR samples. The mismatches were due to the session timezone-sensitive rendering used by this hash method.
- **PASS: WSL_ENCRYPTED_BACKUP_CREATED; GPG_ARCHIVE_READABLE; LOCAL_PG_RESTORE_EXECUTION; LOCAL_19_TABLE_RESTORE; ALL_18_REQUIRED_ROW_COUNT_PARITY; ALL_18_REQUIRED_CONTENT_FINGERPRINT_PARITY_AFTER_UTC**.
- **CLOSE: OFF_PROVIDER_DATABASE_RESTORE_DATA_PARITY_PASS** (bounded database-level user-observed recovery test, not full running-application production disaster recovery).
- Reconciles/supersedes earlier local-row-MD5 mismatch and earlier `ENCRYPTED_DUMP_REAL_RESTORE_PENDING` / `CURRENT_18_TABLE_ENCRYPTED_BACKUP_PENDING` notes for this test archive.
- **Still not verified:** separate off-device/remote storage and key escrow/recovery, app-layer Google OAuth login/auth behavior on the restored database, system-role/privilege exact parity (restore used no-owner/no-privileges), and full disaster recovery cutover. Do not claim `PRODUCTION_RECOVERY_READY` or operational launch authorization solely from this test.
- No change to Neon `main`, live account access, previously created recovery branches or original encrypted archive.

Full Neon reference digests matched again with UTC-normalized local session:
  - `account`: `c4f750204c6bb66424a092bea9d71ce7`
  - `cc_audit`: `c3be99366738a2c09ab764a0746bf59d`
  - `cc_deliverables`: `6dcc64fc222299c895b75ec2343acc42`
  - `cc_members`: `b125a49e4ee85bb01802e24f6e8ee700`
  - `cc_opportunities`: `b5b49cb6f3c5b62ae132fb2582b31020`
  - `cc_opportunity_events`: `d9e1f2da55f9ac3bb66c44b1db7b5afb`
  - `cc_project_events`: `0165543c78997ce412b0064144fc11c5`
  - `cc_project_record_events`: `fa297114b5d12bb4214c9521dcb5e061`
  - `cc_project_records`: `2290c1c5e6425bcbc71147aae2290033`
  - `cc_projects`: `ce1efea93d6c85d637d0af60ef1065ae`
  - `cc_reviews`: `6b3699d08aee198b0af89e5b382d7270`
  - `cc_tasks`: `3058b8cee4e0bf21719f7cc6870b0065`
  - `cc_team_invites`: `99118d958744490854369329686ebf41`
  - `cc_workstream_events`: `55a4613959bc9551d285fc5bf9a837c5`
  - `cc_workstreams`: `a92ef16fca2afed30e53a17539f75cc0`
  - `session`: `1aba574fab2a657d491bbfc0c24a5503`
  - `user`: `2d8eb8bfbffdb3d17cc2fcce827ceaa2`
  - `verification`: `d41d8cd98f00b204e9800998ecf8427e`
