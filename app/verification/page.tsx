import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function VerificationPage() {
  return (
    <SurfacePage
      eyebrow="Verification"
      title="Live verification bindings pending."
      description="This surface will bind deployment runtime, finality, monitoring, and evidence references after they exist."
      state="PENDING"
    >
      <GatedPanel title="Verification" description="No live production verification bundle is asserted by the website yet." />
    </SurfacePage>
  );
}
