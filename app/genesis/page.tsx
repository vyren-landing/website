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
  { index: "01", title: "Eligibility", detail: "Jurisdiction, disclosure and eligibility conditions must be current.", state: "BLOCKED" as const },
  { index: "02", title: "Wallet", detail: "A participant wallet may connect only after the Genesis transaction surface is released.", state: "PENDING" as const },
  { index: "03", title: "Amount", detail: "Protocol bounds apply before any payment instruction can be produced.", state: "PENDING" as const },
  { index: "04", title: "Settlement", detail: "Canonical settlement uses native USDC on Base Mainnet under the live approved scope.", state: "PENDING" as const },
  { index: "05", title: "Finality", detail: "Settlement is usable only after the containing Base L2 block is finalized.", state: "PENDING" as const },
  { index: "06", title: "Entitlement", detail: "A finalized valid settlement may create the protocol-defined Genesis entitlement.", state: "PENDING" as const },
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
      description="The Genesis user journey is designed now so that the site does not need to be rebuilt later. Transactional functionality remains fail-closed until the required protocol, legal, settlement, monitoring and evidence gates are current."
      state="BLOCKED"
      stateLabel="PARTICIPATION CLOSED"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <BindingTable rows={rows} />
        <FlowStepper steps={steps} />
      </div>

      <p className="mt-8 max-w-4xl text-xs leading-6 text-zinc-600">
        These parameters describe frozen protocol rules. They do not represent
        an open offering, an available transaction path, a participant balance
        or a live entitlement.
      </p>
    </SurfacePage>
  );
}
