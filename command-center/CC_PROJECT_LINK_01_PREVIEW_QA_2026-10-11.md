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
