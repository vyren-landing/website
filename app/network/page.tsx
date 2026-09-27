import { publicPageMetadata } from "@/lib/site-metadata";
import BindingTable from "@/components/BindingTable";
import SurfacePage from "@/components/SurfacePage";
import { NETWORK_PROFILE, SETTLEMENT_PROFILE } from "@/lib/site-state";

export const metadata = publicPageMetadata({
  title: "Network",
  description: "Selected Base Mainnet production profile and current deployment-binding state.",
  path: "/network",
});

const rows = [
  { label: "Production chain", value: NETWORK_PROFILE.chain, state: NETWORK_PROFILE.state },
  { label: "Chain ID", value: String(NETWORK_PROFILE.chainId), mono: true },
  { label: "Canonical time", value: NETWORK_PROFILE.canonicalTime },
  { label: "VYREN production address", value: "Pending deployment", state: "PENDING" as const },
  { label: "Native USDC", value: SETTLEMENT_PROFILE.contract, mono: true },
  { label: "Bridged USDbC", value: "Excluded from canonical Genesis settlement" },
] as const;

export default function NetworkPage() {
  return (
    <SurfacePage
      eyebrow="Network"
      title="Selected chain. Unbound production instance."
      description="Base Mainnet is the selected production-chain profile, but the website does not publish a VYREN production address until deployment and runtime equality evidence exist."
      state="PENDING"
    >
      <BindingTable rows={rows} />
      <p className="mt-6 max-w-4xl text-xs leading-6 text-zinc-600">
        Finality-sensitive lifecycle evidence becomes usable only after the
        containing Base L2 block satisfies the frozen finality rule.
      </p>
    </SurfacePage>
  );
}
