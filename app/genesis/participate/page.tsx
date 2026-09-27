import type { Metadata } from "next";
import BindingTable from "@/components/BindingTable";
import LockedAction from "@/components/LockedAction";
import SurfacePage from "@/components/SurfacePage";
import { GENESIS_PROFILE, NETWORK_PROFILE, SETTLEMENT_PROFILE } from "@/lib/site-state";

export const metadata: Metadata = {
  title: "Genesis Participation",
  robots: { index: false, follow: false },
};

const rows = [
  { label: "Network", value: `${NETWORK_PROFILE.chain} · Chain ID ${NETWORK_PROFILE.chainId}`, state: NETWORK_PROFILE.state },
  { label: "Settlement asset", value: SETTLEMENT_PROFILE.asset, state: SETTLEMENT_PROFILE.state },
  { label: "USDC contract", value: SETTLEMENT_PROFILE.contract, mono: true },
  { label: "Genesis reference", value: GENESIS_PROFILE.price },
  { label: "Allowed amount", value: `${GENESIS_PROFILE.minimum} minimum · ${GENESIS_PROFILE.cumulativeMaximum} cumulative maximum` },
] as const;

export default function ParticipatePage() {
  return (
    <SurfacePage
      eyebrow="Genesis / Participate"
      title="Transaction surface disabled."
      description="The future participation screen is represented without wallet, approval, payment or contract-call code. This preserves the intended user journey while preventing premature execution."
      state="BLOCKED"
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <BindingTable rows={rows} />
          <div className="mt-6 rounded-2xl border border-zinc-900 bg-[#080808] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Future amount control</p>
            <div className="mt-4 rounded-xl border border-zinc-900 bg-black px-5 py-5">
              <p className="text-xs text-zinc-600">VYREN amount</p>
              <p className="mt-2 text-2xl text-zinc-500">—</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-zinc-600">
              No quote, allowance, payment instruction or entitlement preview is
              generated in PRE-GENESIS mode.
            </p>
          </div>
        </div>
        <LockedAction
          title="Connect wallet and continue"
          reason="Wallet connection and payment execution remain disabled until participation is explicitly released under live canonical bindings."
        />
      </div>
    </SurfacePage>
  );
}
