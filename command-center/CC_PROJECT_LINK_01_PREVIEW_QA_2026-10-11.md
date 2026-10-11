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
