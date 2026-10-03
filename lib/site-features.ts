import { PROTOCOL_STATE } from "@/lib/site-state";

/**
 * Presentation flags control what the website may render.
 * They are not protocol authority and must never be treated as transaction authorization.
 */
export const SITE_FEATURES = {
  publicProtocolSurface: true,
  publicArchitectureSurface: true,
  publicEcosystemSurface: true,
  publicEconomicsSurface: true,
  publicLifecycleSurface: true,
  publicEvidenceSurface: true,
  publicDocsSurface: true,
  publicStatusSurface: true,

  genesisInformationSurface: true,
  genesisTransactions: false,
  walletConnection: false,
  participantAccount: false,

  liveNetworkData: false,
  liveLiquidityData: false,
  liveVerificationData: false,
} as const;

export const PARTICIPATION_REQUIREMENTS = [
  "G-GENESIS legal / eligibility scope current",
  "Safeguarding, payment and refund path current",
  "Required Genesis-facing monitoring and evidence current",
  "Public terms / disclosures current for the actual route",
  "Protocol participation state open",
] as const;

/**
 * Hard fail-closed website view.
 *
 * Future transactional code must derive authorization from server-side/live
 * canonical bindings and required evidence. Changing a UI flag alone must never
 * open participation.
 */
export const PARTICIPATION_AVAILABILITY = {
  enabled:
    SITE_FEATURES.genesisTransactions &&
    SITE_FEATURES.walletConnection &&
    PROTOCOL_STATE.participationOpen,
  state: "PRE-GENESIS",
  reason: "Participation is not open.",
  requirements: PARTICIPATION_REQUIREMENTS,
} as const;
