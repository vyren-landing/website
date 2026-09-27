export type ProtocolLifecycle =
  | "ARCHITECTURAL"
  | "PRE_GENESIS"
  | "GENESIS_OPEN"
  | "ACTIVATION_PREPARATION"
  | "ACTIVE";

export type EvidenceState =
  | "CURRENT"
  | "DUE"
  | "STALE"
  | "INVALID"
  | "PENDING"
  | "BLOCKED"
  | "NOT_ASSERTED";

export const PROTOCOL_STATE = {
  version: "Rev4.6",
  lifecycle: "PRE_GENESIS" as ProtocolLifecycle,
  tokenLive: false,
  participationOpen: false,
  productionDeployment: "PENDING" as EvidenceState,
  productionProfilesCurrent: 0,
  productionProfilesTotal: 10,
  r2: "PENDING" as EvidenceState,
  gateG: "BLOCKED" as EvidenceState,
  activation: "NOT_ASSERTED" as EvidenceState,
} as const;

export const PROTOCOL_STATE_LABEL = "PRE-GENESIS";

export const protocolStateSummary = [
  {
    label: "Architecture",
    value: "Rev4.6 canonical",
    state: "CURRENT" as EvidenceState,
  },
  {
    label: "Production deployment",
    value: "Not started",
    state: "PENDING" as EvidenceState,
  },
  {
    label: "Production profiles",
    value: `${PROTOCOL_STATE.productionProfilesCurrent}/${PROTOCOL_STATE.productionProfilesTotal} CURRENT`,
    state: "PENDING" as EvidenceState,
  },
  {
    label: "Gate G",
    value: "Blocked / not asserted",
    state: "BLOCKED" as EvidenceState,
  },
] as const;
