# VYREN | Public source, tests and verification boundary | 2026-11-03

Classification: Website disclosure / engineering evidence mapping. This file is **not** a canonical Rev4.6 constitutional decision, LC decision, START permission, product release or declaration that the latest integrated successor ZIP has been updated.

## Source identity and scoped evidence

| Record | Source | Evidence | Limitation |
|---|---|---|---|
| Pinned reproducible build baseline | `6559e4cd5394ad4b32b966681223b98637a59282` (source tree `53d31cb452ce944a3fa884cbcc70567a165cb283`; 2026-09-27) | Previously recorded 59/59 Build A, 59/59 Build B, 220/220 static, 82/82 artifact equality; preserve record | Historical pinned source, NOT verification that all newer research commits reproduce these results |
| WP14 R13 research source | `64bff9f955d04e324656cb9c6a15651df26d296f` (2026-11-02) | [R13 workflow](https://github.com/vyren-landing/vyren-rev46-canonical/actions/runs/41505374595) succeeded for its scoped native BLS, live conditional observer, R12 and R11 regressions | Research checks do not prove authenticated L1 finality, actual Base state proof, full E5, end-to-end product or production readiness |
| General F2B CI on R13 source | Same R13 source | [F2B CI](https://github.com/vyren-landing/vyren-rev46-canonical/actions/runs/41505374353) failed at **Restore pinned dependency snapshots** | Static verification and subsequent build steps were skipped; do not misrepresent as failed compiler tests or as core PASS |
| R14 | Research branch at R13 SHA on 2026-11-03 review | No separately verified R14 success | Independent checkpoint/rotation remains pending, no authority granted |

## Website corrections

- `components/BuildProof.tsx`: historic source/build evidence identified by pinned commit and date, never renamed to latest.
- `components/ResearchEvidence.tsx`: separate later research record, direct GitHub evidence, open finality and CI boundaries.
- `app/evidence/page.tsx` and `app/verification/page.tsx`: both records surfaced separately; older `Canonical commit` label narrowed to `Pinned build commit`.
- `lib/site-state.ts`: central research-evidence record; existing Rev4.6 PRE-GENESIS / NOT OPEN / production PENDING economic and lifecycle data remain unchanged.

## Affected-authority propagation

- Rev4.6 core architecture, supply, Genesis price, vesting, Founder/FOW rights, FFA, GNR, LC and VDCP: **NO DECISION CHANGE**.
- WP14 research and F2B CI: **NO NEW PASS** beyond exact GitHub Actions results.
- Command Center: **NO NEW CANONICAL AUTHORITY**.
- R13 integrated successor: still requires raw-source access for actual internal cross-document synchronization; this site edit does **not** replace it.
- RootData or another third party: source citations may describe this public status; no listing, approval or acceptance implied.

## Acceptance criteria for public change

1. Site build compiles and preview loads `/status`, `/evidence`, and `/verification`.
2. Pinned baseline remains distinguishable from R13 research workflow.
3. General F2B CI failure is explicitly attributed to dependency snapshot restore and skipped downstream steps.
4. Production, participation, Genesis, economic parameters and gates remain unchanged.
5. Do not promote to live without verified preview and a separate release/promotion decision.
