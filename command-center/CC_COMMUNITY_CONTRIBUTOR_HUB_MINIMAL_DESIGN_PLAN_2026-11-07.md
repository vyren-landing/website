# VYREN Community + Contributor Hub — Minimal Design Plan
**Date:** 2026-11-07
**Status:** WORKING IMPLEMENTATION PLAN / NOT A CANONICAL OR LIFECYCLE DECISION / NO RELEASE AUTHORIZATION
**Code baseline:** `vyren-landing/website`, `feature/command-center-phase2-auth-db-20261009`, Command Center under `command-center/`; public `main` site currently uses `components/SiteNav.tsx`.
**Product-direction baseline:** Library `/token ve ekosistem/VYREN_Command_Center_Master_Entegrasyon_Guncellemesi_2026-11-07.md`, especially `CC-CONTRIBUTOR-HUB-01`, `CC-CONTRIBUTOR-COORD-01`, `CC-CONTRIBUTOR-NETWORK-01`, `CC-CONTRIBUTOR-ACCESS-01`; existing Command Center QA/recovery ledgers.
**Authority rule:** Existing Rev4.6, current FFA, LC and GNR-STD-001 current canonical version control; Founder–VYREN relationship, rights/economic freedom/security/continuity/recovery and governance separation unchanged.

## 1. Purpose
Provide a small, welcoming VYREN space for discovery, questions, technology/Web3/crypto discussion, feedback, ideas and voluntary contribution. Preserve the existing Founder/Contributor task, project, review and assignment workflow. Approved Contributors additionally share a private team discussion area connected to existing work. A general community member can be valuable without joining an assigned team.

`Discover → Discuss / Ask → Suggest → Volunteer → (if selected) Collaborate on existing work`.
This is an opportunity path, not a compulsory funnel, entitlement, token grant, employment promise or canonical governance vote.

## 2. Current verified source posture
- Existing: Next.js 15 Command Center Preview on Vercel, Better Auth backed by Neon PostgreSQL; GitHub Founder authentication, Google invited Contributor authentication, server-side task ownership; tasks, projects, project records, workstreams, opportunities, team/invitations, assignment reports, audit, recovery QA.
- Existing `MemberRole` and `cc_members.role` are only `Founder | Contributor`. `getActor()` returns null for unapproved accounts; `/secure` and `/api/cc` are **not** open-community entrypoints. Preserve these contracts.
- Existing public website `components/SiteNav.tsx` has no Community link. Public website and Command Center are separate Vercel projects. OAuth configured fixed-host principle must be preserved.
- Community posts, public registration, LinkedIn login, private team discussion and the public site entry link are NOT YET IMPLEMENTED/VERIFIED.
- Older Contributor 15/15 negative authorization QA and independent database data-restore parity PASS are bounded historical evidence; neither validates new public/community endpoints.
- Last audited feature-branch commit before this plan: `fb70f6190eb762f5b0201bef852c58024e1e2cc2` (QA documentation, 2026-10-31).

## 3. Minimal navigation / user-facing screens
### Public / signed-in community
1. **Community** — single paginated discussion feed with topic filters: `General`, `Technology & Web3`, `Crypto & Ecosystem`, `VYREN Q&A`, `Ideas`. Guests may read approved public discussions; posting and commenting require a signed-in member.
2. **Learn VYREN** — short, source-linked FAQ/approved official explanations drawn from canonical public website/docs, distinguished from member opinions; not a second canonical source.
3. **Contribute** — short explanation of voluntary contribution, a `I want to contribute` expression of interest or suggestion, and current approved open opportunities when available. No auto-acceptance, compensation, entitlement or assignment.
### Approved Contributor additional view
4. **Workspace** — existing `My Tasks`, deliverables and project access unchanged, plus a **Team Space** as a private category/feed restricted server-side to currently active approved Contributors/Founder.
### Founder
Existing Turkish Founder admin screens continue; community moderation queue and volunteer intake may be integrated minimally into existing Founder UI. Contributor/member-facing UI stays English.

One shared content/threads engine with categories and `PUBLIC | TEAM` visibility, NOT separate chat/community products. No private direct messaging, voice/video, real-time chat, gamification, reaction/voting-based governance, complex notification engine or automatic task creation in the MVP.

## 4. Roles and trust boundaries
- **Guest:** Read published/approved public content and verified public FAQ only; cannot post, view private Team Space, use CC tasks or see internal member records.
- **Community member:** LinkedIn or Google OAuth sign-in; own display profile, public posts, comments, suggestions and volunteer expression; no `cc_members` role or task API permissions implied.
- **Approved Contributor:** Existing `cc_members` invitation/active rules, own tasks and private Team Space; community features too. A linked LinkedIn identity does not automatically upgrade an account to Contributor.
- **Founder:** Existing Founder identity/rights and permission logic intact; separate operational content moderation / volunteer triage privileges; no protocol-governance change.
- **Coordinator (later):** Only if approved by Founder and accepted by individual; narrow team coordination permissions, revocable/replaceable, never independent governance, compensation commitment or privileged social/infrastructure access.
- **No vote-to-govern:** community endorsements / proposals never directly alter economics, FFA, lifecycle, funding, employment, public promises or canonical work acceptance.

**Critical identity constraint:** Existing Better Auth `accountLinking.disableImplicitLinking=true` remains. Matching LinkedIn/Google email is not evidence of the same person and must not automatically merge users or migrate `cc_members`/invitation authority. Any account link must be authenticated, explicit, verified and fail-closed. Preserve existing Google invitation binding and Founder GitHub recognition.

## 5. Minimal database/domain design (proposal only)
Add new tables in a separate reviewed non-destructive migration, **without changing `cc_members.role` or rewriting existing `user/session/account` rows**:
- `cc_community_profiles`: auth user reference, display name, optional areas of interest / willingness to contribute, visibility/consent and timestamps.
- `cc_community_posts`: author, topic/category, title/body, `visibility=PUBLIC|TEAM`, optional `related_work` reference if authorized, moderation status, edit history/timestamps.
- `cc_community_comments`: parent post, author, body, moderation state/timestamps.
- `cc_community_reports`: reporting actor, target, reason, disposition, timestamps. Founder-only review initially.
Public suggestions and questions are categories of posts, not new workflow engines. Volunteer interest can be a narrow profile field or a classified post at first; do not create a separate recruiting CRM without evidence.

Private Team Space is API-row-scoped by an active approved `cc_members` membership, not merely hidden in navigation. Public APIs do not return `TEAM` content, task data, member identities, internal references or audit records.

## 6. Sign-in and public website entry
- Add LinkedIn OIDC (`openid profile email`) only with actual LinkedIn Developer application, approved product and tested fixed-origin callback; Better Auth generic OAuth/version compatibility must be checked against locked installed version before modifying authentication. Google fallback retained; GitHub Founder remains as-is.
- No email/password, privileged LinkedIn social posting or import of LinkedIn contacts in MVP.
- Add visible English `Community` navigation/CTA on public `vyren.io` after destination, signup, abuse controls and OAuth flow are ready. Existing site navigation must remain usable on desktop and mobile; avoid overcrowding it.
- Use a stable, explicitly verified community/auth hostname; `community.vyren.io` is a **candidate**, not a claimed deployed hostname. No permanent vendor, DNS or provider dependency is created.
- Community UI may be built and reviewed in separate Preview without changing public production `vyren.io`; website redirect goes live only after explicit approval.

## 7. Bare-minimum public safety and evidence
- Server-side permission checks for every route, including `TEAM` read, post and comments; CSRF/same-origin safeguards; length and rate limits; XSS-safe rendering; no arbitrary executable HTML.
- Report/hide abusive content, basic Founder moderation actions, audit and recoverable data. Distinguish official VYREN explanations from community opinions; avoid fabricated return/listing/Genesis participation claims or unofficial payment instructions.
- Terms/privacy and appropriate public UGC notice/handling before public signup. Collect minimum OAuth personal data; no auto-export of social graphs; allow account-data/access handling consistent with law and applicable privacy requirements.
- Data export, PostgreSQL backup and isolated restore for new tables; preserve and build on established existing encryption/restore workflow. No public UI or vendor should become a single unrecoverable authority point.
- Initial moderation by Founder is a *practical pilot*, not a permanent mandatory approval bottleneck: scoped later delegation/recovery permitted without granting canonical authority.
- Published public content and team records remain operational/social, never authoritative Rev4.6/VDCP canonical evidence or Founder/FOW rights.

## 8. Staged implementation, small batches
| Phase | Work | Evidence needed | Non-goals |
|---|---|---|---|
| 0 | Freeze source inventory/branch and produce UI/page map + migration safety plan | Existing roles/API/restore baseline captured | No production change |
| 1 | Public read-only Community + Learn VYREN shell and safe feed model in Preview; new tables via reviewed additive migration | Anonymous sees only public approved content, Founder/Contributor old views intact | No public launch yet |
| 2 | Google-enabled public member registration and separate community identity authorization; LinkedIn OIDC configured/tested when credentials/product ready | Normal member cannot reach any `/secure` task or Founder API; no accidental account linking | LinkedIn provider readiness does NOT block UI/data development |
| 3 | Authenticated simple post/comment/ideas + voluntary interest + report/moderation | Create/read/update visibility, report, abuse rate limit, API guards, privacy UX and data recovery | No chat, DMs, automated assignment |
| 4 | Private Contributor Team Space on same thread engine + optional links to existing tasks | Two-role private-read denial, existing own-task tests, role revoke test, audit | No new governance or auto-approval |
| 5 | Public website `Community` entry and stable URL after explicit release approval | Mobile/desktop nav, fixed OAuth origin and actual public readiness checks | Never alter public site prematurely |

Phases can be combined when evidence and implementation cost justify it; no independent staffing, vendor, coordinator, exact social-activity quota, paid tool or extra approvals are universal hard prerequisites.

## 9. QA acceptance: one concise set
1. Founder existing tasks/projects/team/permissions and Turkish UX unchanged.
2. Approved Contributor own-task flow remains English; private team access works; no Founder rights.
3. Registered public member can post/comment only in public space and cannot access `/secure`, team posts or operational APIs.
4. Anonymous sees only explicitly public content.
5. Existing GitHub Founder and Google Contributor OAuth still work; LinkedIn sign-in works only if product/callback credentials are actually available; no implicit account promotion/merging.
6. Content reports/moderation, basic rate limits and official-vs-community distinction work.
7. Existing Neon data preserved; new records included in encrypted backup/isolated restore verification.
8. VYREN.IO desktop/mobile Community navigation works after separate authorization to publish.

## 10. Status / next action
`DESIGN_PLAN_READY / NEW COMMUNITY MODULES_NOT_IMPLEMENTED / LINKEDIN_OIDC_NOT_CONFIGURED / PRODUCTION_SITE_UNCHANGED`.

**Next implementation point:** draft the additive schema and route-level authorization matrix in feature branch; implement a tiny read-only Community + Learn VYREN Preview shell using one thread model. Leave live `main` data and public `main` website untouched until separately authorized.

**No-loss and GNR:** This plan does not supersede 2026-11-07 accepted Contributor Hub product direction, 2026-10-31 Command Center QA/recovery records or existing Founder–VYREN/FFA/Rev4.6 constraints. Omission is not supersession. GNR No-Self-Lock, Solution Duty, affirmative rights/security and replaceability control every material implementation.
