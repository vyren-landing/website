import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function LiquidityPage() {
  return (
    <SurfacePage
      eyebrow="Liquidity"
      title="Live liquidity evidence pending."
      description="Pool, funded positions, TWAP, and impact evidence remain unavailable until production market formation exists."
      state="PENDING"
    >
      <GatedPanel title="Liquidity evidence" description="No live production pool or depth metric is asserted." />
    </SurfacePage>
  );
}
