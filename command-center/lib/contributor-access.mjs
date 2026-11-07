/**
 * Operational Command Center access policy. This is NOT protocol governance.
 * Existing invitation/test identities remain compatible. A direct grant row,
 * including a revoked row, takes precedence when community access is enabled.
 *
 * @param {{founder:boolean, legacyApproved:boolean, invitationActive:boolean, directGrant:boolean|null}} state
 * @returns {'Founder'|'Contributor'|null}
 */
export function resolveOperationalRole(state) {
  if (state.founder === true) return 'Founder';
  if (state.directGrant !== null) return state.directGrant === true ? 'Contributor' : null;
  return state.legacyApproved === true || state.invitationActive === true ? 'Contributor' : null;
}

/**
 * An authenticated provider identity alone is not workspace membership.
 * The persisted row must agree with the resolved authority and remain active.
 * @param {'Founder'|'Contributor'|null} role
 * @param {{role:string, active:boolean}|null|undefined} member
 */
export function hasActiveWorkspaceRole(role, member) {
  return role !== null && member?.role === role && member.active === true;
}

/**
 * One decision policy for Founder-selected community member grants. Readable
 * failure reasons are mapped to localized API responses by the route handler.
 * @param {{operation:'grant'|'revoke', actorIsTarget:boolean, targetIsFounder:boolean, verified:boolean, legacyContributor:boolean, hasDirectGrant:boolean, directGrantActive:boolean}} input
 * @returns {'founder'|'legacy'|'unverified'|'already_active'|'not_active'|null}
 */
export function directGrantRejection(input) {
  if (input.actorIsTarget || input.targetIsFounder) return 'founder';
  if (input.legacyContributor && !input.hasDirectGrant) return 'legacy';
  if (input.operation === 'grant') {
    if (!input.verified) return 'unverified';
    return input.directGrantActive ? 'already_active' : null;
  }
  return input.hasDirectGrant && input.directGrantActive ? null : 'not_active';
}

/**
 * Closing public enrollment must not suspend existing revocations or lock the
 * Founder out of emergency revocation. New grants still require enrollment
 * to be explicitly enabled. The route must separately authenticate Founder.
 * @param {{tablesReady:boolean, enrollmentOpen:boolean, operation:'grant'|'revoke'}} state
 */
export function directGrantOperationAllowed(state) {
  if (!state.tablesReady) return false;
  return state.enrollmentOpen === true || state.operation === "revoke";
}
