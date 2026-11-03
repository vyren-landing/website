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
  gateGenesis: "PENDING" as EvidenceState,
  gateActive: "NOT_ASSERTED" as EvidenceState,
  gateMarket: "NOT_ASSERTED" as EvidenceState,
  activation: "NOT_ASSERTED" as EvidenceState,
} as const;

export const PROTOCOL_STATE_LABEL = "PRE-GENESIS";

export const CANONICAL_IMPLEMENTATION = {
  repository: "vyren-rev46-canonical",
  commit: "6559e4cd5394ad4b32b966681223b98637a59282",
  tree: "53d31cb452ce944a3fa884cbcc70567a165cb283",
  buildA: "59 / 59 PASS",
  buildB: "59 / 59 PASS",
  staticVerification: "220 / 220 PASS",
  artifactEquality: "82 / 82",
} as const;

export const WP14_RESEARCH_EVIDENCE = {
  milestone: "WP14 R13",
  asOf: "2026-11-02",
  repository: "vyren-rev46-canonical",
  sourceCommit: "64bff9f955d04e324656cb9c6a15651df26d296f",
  researchBranch: "research-lc40-wp14-r13-beacon-bls-20261102",
  researchRunUrl: "https://github.com/vyren-landing/vyren-rev46-canonical/actions/runs/41505374595",
  coreCiRunUrl: "https://github.com/vyren-landing/vyren-rev46-canonical/actions/runs/41505374353",
  scopedResult: "Research workflow PASS",
  scope: "R13 real BLS/conditional checkpoint tests plus R12 SSZ and R11 Ethereum provenance regressions",
  coreCiResult: "FAILED during pinned dependency snapshot restore; later static/build steps SKIPPED",
  authenticatedBeaconFinality: "NOT VERIFIED",
  realBaseStateProof: "NOT VERIFIED",
  fullE5AndProductAcceptance: "PENDING",
  migrationOrLaunchAuthority: "NONE",
  r14IndependentResult: "NOT VERIFIED",
} as const;

export const NETWORK_PROFILE = {
  chain: "Base Mainnet",
  chainId: 8453,
  state: "PENDING" as EvidenceState,
  productionVyrenAddress: null,
  canonicalTime: "EVM block.timestamp -> Unix UTC seconds",
  finalityRule: "Hard lifecycle evidence only after the containing Base L2 block is finalized.",
} as const;

export const SETTLEMENT_PROFILE = {
  asset: "Native USDC",
  network: "Base Mainnet",
  contract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  bridgedUsdbcAllowed: false,
  identityFormat: "BASE8453:USDC:<tx_hash>:<log_index>",
  state: "PENDING" as EvidenceState,
} as const;

export const LIQUIDITY_PROFILE = {
  venue: "Uniswap v3",
  network: "Base Mainnet",
  pair: "VYREN / native USDC",
  route: "Direct only",
  feeTier: "0.30% / 3000",
  tickSpacing: 60,
  baselineRange: "-887220..887220",
  reference: "30-minute geometric TWAP",
  readinessNotional: "USD 5,000 each direction",
  maxVenueImpact: "≤2.00% BUY and SELL",
  poolAddress: null,
  state: "PENDING" as EvidenceState,
} as const;

export const GENESIS_PROFILE = {
  price: "USD 0.025 / VYREN",
  minimum: "5,000 VYREN",
  cumulativeMaximum: "100,000 VYREN",
  vesting: "90-day cliff + 12 calendar months linear",
  settlementAsset: "Native USDC on Base Mainnet",
  state: "PENDING" as EvidenceState,
} as const;

export const protocolStateSummary = [
  {
    label: "Architecture",
    value: "Rev4.6 canonical",
    state: "CURRENT" as EvidenceState,
  },
  {
    label: "Canonical implementation",
    value: "Pinned build record; later WP14 evidence is scoped research",
    state: "CURRENT" as EvidenceState,
  },
  {
    label: "Production deployment",
    value: "Not started",
    state: "PENDING" as EvidenceState,
  },
  {
    label: "G-GENESIS",
    value: "External implementation evidence pending",
    state: "PENDING" as EvidenceState,
  },
] as const;
