import BindingTable from "@/components/BindingTable";
import SurfacePage from "@/components/SurfacePage";
import { LIQUIDITY_PROFILE } from "@/lib/site-state";

const rows = [
  { label: "Primary venue", value: `${LIQUIDITY_PROFILE.venue} on ${LIQUIDITY_PROFILE.network}` },
  { label: "Canonical pair", value: LIQUIDITY_PROFILE.pair },
  { label: "Route", value: LIQUIDITY_PROFILE.route },
  { label: "Fee tier", value: LIQUIDITY_PROFILE.feeTier },
  { label: "Tick spacing", value: String(LIQUIDITY_PROFILE.tickSpacing), mono: true },
  { label: "Baseline range", value: LIQUIDITY_PROFILE.baselineRange, mono: true },
  { label: "Reference", value: LIQUIDITY_PROFILE.reference },
  { label: "Readiness test", value: `${LIQUIDITY_PROFILE.readinessNotional} · ${LIQUIDITY_PROFILE.maxVenueImpact}` },
  { label: "Production pool", value: "Not created / bound", state: LIQUIDITY_PROFILE.state },
] as const;

export default function LiquidityPage() {
  return (
    <SurfacePage
      eyebrow="Liquidity"
      title="Measurement policy selected. Live market evidence pending."
      description="The liquidity-readiness profile is defined in advance, but no live VYREN/native-USDC pool, liquidity position or executable-depth result is asserted."
      state="PENDING"
    >
      <BindingTable rows={rows} />
      <section className="mt-8 max-w-4xl rounded-2xl border border-zinc-900 bg-[#080808] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Readiness rule</p>
        <p className="mt-4 text-sm leading-7 text-zinc-500">
          BUY and SELL tests must originate from the same finalized Base
          snapshot, each at the frozen USD 5,000 notional policy. A one-sided,
          stale or mixed-snapshot result cannot establish CURRENT.
        </p>
      </section>
    </SurfacePage>
  );
}
