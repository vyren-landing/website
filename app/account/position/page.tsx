import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function PositionPage() {
  return (
    <SurfacePage
      eyebrow="Account / Position"
      title="No live position."
      description="Allocation, vesting, unlock, and settlement state will be shown only from live canonical data."
      state="PENDING"
    >
      <GatedPanel title="Position" description="No participant position is asserted." />
    </SurfacePage>
  );
}
