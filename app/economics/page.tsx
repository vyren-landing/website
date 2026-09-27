import SurfacePage from "@/components/SurfacePage";

export default function EconomicsPage() {
  return (
    <SurfacePage
      eyebrow="Economics"
      title="Economic rules are disclosed without simulating a live market."
      description="Current public economics should reflect canonical Rev4.6 rules and disclosure gates. Transactional availability, market formation, and participant balances are not implied by this page."
    >
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-zinc-400">
        <p>
          Core numerical anchors may be disclosed when their release gate permits.
          Full implementation tables and live balances remain separate from public
          explanatory content.
        </p>
        <p>
          Founder, Foundation, participant, reserve, settlement, and liquidity
          paths must remain distinguishable rather than compressed into a generic
          tokenomics graphic.
        </p>
      </div>
    </SurfacePage>
  );
}
