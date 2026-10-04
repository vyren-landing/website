import { publicPageMetadata } from "@/lib/site-metadata";
import BindingTable from "@/components/BindingTable";
import FlowStepper from "@/components/FlowStepper";
import SurfacePage from "@/components/SurfacePage";
import { GENESIS_PROFILE, SETTLEMENT_PROFILE } from "@/lib/site-state";

export const metadata = publicPageMetadata({
  title: "Genesis",
  description: "Final-form Genesis information surface operating in PRE-GENESIS mode. Participation is closed.",
  path: "/genesis",
});

const steps = [
  { index: "01", title: "Eligibility", detail: "The actual jurisdiction, disclosure and eligibility scope must be current before intake.", state: "BLOCKED" as const },
  { index: "02", title: "Wallet", detail: "A participant wallet may connect only after the Genesis transaction surface is explicitly released.", state: "PENDING" as const },
  { index: "03", title: "Amount", detail: "Protocol minimum and cumulative maximum are checked before any payment instruction.", state: "PENDING" as const },
  { index: "04", title: "Safeguarded payment", detail: "Participant consideration follows the live approved safeguarding/payment path; provider receipt alone does not create entitlement.", state: "PENDING" as const },
  { index: "05", title: "Technical finality", detail: "The relevant Base payment evidence must reach the required finalized-chain boundary.", state: "PENDING" as const },
  { index: "06", title: "Legal finality", detail: "Any applicable withdrawal, cancellation or refund boundary must be resolved under the actual legal route.", state: "PENDING" as const },
  { index: "07", title: "Canonical entitlement", detail: "Only after the required technical and legal finality conditions pass may the deterministic Genesis entitlement be confirmed.", state: "PENDING" as const },
  { index: "08", title: "GENESIS_LOCKED", detail: "The confirmed entitlement enters the canonical locked state under the controlling vesting rules.", state: "PENDING" as const },
] as const;

const rows = [
  { label: "Genesis reference", value: GENESIS_PROFILE.price },
  { label: "Minimum", value: GENESIS_PROFILE.minimum },
  { label: "Cumulative maximum", value: GENESIS_PROFILE.cumulativeMaximum },
  { label: "Vesting", value: GENESIS_PROFILE.vesting },
  { label: "Settlement rail", value: GENESIS_PROFILE.settlementAsset, state: SETTLEMENT_PROFILE.state },
] as const;

export default function GenesisPage() {
  return (
    <SurfacePage
      eyebrow="Genesis"
      title="Final-form interface. PRE-GENESIS state."
      description="The Genesis user journey is designed now so that the site does not need to be rebuilt later. Transactional functionality remains fail-closed until the applicable G-GENESIS, safeguarding, settlement, monitoring and public-disclosure conditions are current."
      state="BLOCKED"
      stateLabel="PARTICIPATION CLOSED"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <BindingTable rows={rows} />
        <FlowStepper steps={steps} />
      </div>

      <div className="mt-8 max-w-4xl">
        <p className="text-xs leading-6 text-zinc-600">
          These parameters describe frozen protocol rules. They do not represent
          an open offering, an available transaction path, a participant balance
          or a live entitlement.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          <a
            href="/docs/participation"
            className="text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
          >
            Read the pre-Genesis participation preparation guide
          </a>
          <a
            href="/genesis/updates"
            className="text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
          >
            Follow Genesis updates
          </a>
        </div>
      </div>
    </SurfacePage>
  );
}
