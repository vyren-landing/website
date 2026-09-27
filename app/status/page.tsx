import { publicPageMetadata } from "@/lib/site-metadata";
import BuildProof from "@/components/BuildProof";
import StateBadge from "@/components/StateBadge";
import SurfacePage from "@/components/SurfacePage";
import { PROTOCOL_STATE, protocolStateSummary } from "@/lib/site-state";

export const metadata = publicPageMetadata({
  title: "Status",
  description: "Current VYREN lifecycle, implementation evidence and live-readiness boundaries. Current mode: PRE-GENESIS.",
  path: "/status",
});

const pending = [
  "Production signer and public deployment identity binding",
  "Base Mainnet deployment and runtime equality",
  "Finality and production-chain evidence",
  "Live VYREN / native-USDC liquidity and market-depth evidence",
  "Production monitoring and freshness evidence",
  "Independent F2E assurance",
  "Gate G live legal / entity / provider evidence",
] as const;

export default function StatusPage() {
  return (
    <SurfacePage
      eyebrow="Status"
      title="PRE-GENESIS"
      description="Architecture and canonical implementation are materially advanced. Production deployment and live readiness are not asserted. This page preserves that distinction."
      state="PENDING"
      stateLabel="PRE-GENESIS"
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2">
        {protocolStateSummary.map((item) => (
          <section key={item.label} className="bg-black p-6">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium">{item.label}</h2>
              <StateBadge state={item.state} />
            </div>
            <p className="mt-4 text-sm text-zinc-500">{item.value}</p>
          </section>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <BuildProof />

        <section className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Remaining live boundary</p>
          <div className="mt-6 divide-y divide-zinc-900 border-y border-zinc-900">
            {pending.map((item) => (
              <div key={item} className="flex gap-3 py-4">
                <StateBadge state="PENDING" />
                <p className="text-sm leading-6 text-zinc-500">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-900 p-6 text-sm leading-7 text-zinc-500">
        R2: {PROTOCOL_STATE.r2} · Gate G: {PROTOCOL_STATE.gateG} · Activation: {PROTOCOL_STATE.activation}
      </div>
    </SurfacePage>
  );
}
