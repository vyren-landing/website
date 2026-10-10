# VYREN Command Center — MVP Preview

This is an **isolated UI/flow demonstration** on a feature branch, not a production management system.

## Boundaries
- Source of truth for protocol, economics, governance, founder rights, Genesis lifecycle, and GNR remains EXTERNAL to this app.
- Canonical references are read-only. Nothing in this app can authorize Genesis, alter protocol rights or approve economic/legal commitments.
- Founder and Test Contributor personas are **simulated, not authenticated user accounts**.
- All changes are saved to browser localStorage for preview convenience. **No shared database, access control, real invitations, signed approvals, sensitive documents, or external messages** are implemented.
- Real users, external organizations, and providers are not contacted.
- Seed content is demonstrative and not live project status.
- Never enter passwords, wallet seeds, confidential provider data, client PII or other secrets into this preview.

## Run locally
```
npm install
npm run dev
```

## Before real users or production
1. Implement trusted email-based authentication and session management.
2. Implement backend authorization and auditable roles; UI-only persona switching is never security.
3. Add PostgreSQL with migrations, environment segregation and backup/export.
4. Implement evidence storage permissions, encryption and retention/export policies.
5. Add invite/accept/revoke workflows and account recovery.
6. Wire canonical registry read-only with verified version/effective-scope semantics.
7. Add automated permission, database isolation, workflow, and restore tests.
8. Keep this application in an independent Vercel project; do not overwrite the public website.

VYREN Command Center is an execution control plane, not VDCP acceptance or governance authority.
