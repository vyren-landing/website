import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function ActivityPage() {
  return (
    <SurfacePage
      eyebrow="Account / Activity"
      title="No participant activity."
      description="Live transaction and settlement history will be surfaced only after canonical bindings exist."
      state="PENDING"
    >
      <GatedPanel title="Activity" description="No participant history is asserted." />
    </SurfacePage>
  );
}
