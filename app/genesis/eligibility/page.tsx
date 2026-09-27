import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function EligibilityPage() {
  return (
    <SurfacePage
      eyebrow="Genesis / Eligibility"
      title="Eligibility checks are inactive."
      description="No eligibility result is implied before the live legal and provider profile is bound."
      state="BLOCKED"
    >
      <GatedPanel
        title="Eligibility"
        description="This surface will later present the required jurisdiction, disclosure, and eligibility flow. It currently performs no eligibility determination."
      />
    </SurfacePage>
  );
}
