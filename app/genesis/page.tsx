import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";
import { PARTICIPATION_AVAILABILITY } from "@/lib/site-features";

export default function GenesisPage() {
  return (
    <SurfacePage
      eyebrow="Genesis"
      title="Participation is not open."
      description="The Genesis interface is part of the final-form website architecture, but transactional functionality remains disabled until its external dependencies are current."
      state="PENDING"
      stateLabel="PRE-GENESIS"
    >
      <GatedPanel
        title="Genesis Participation"
        description={PARTICIPATION_AVAILABILITY.reason}
        requirements={PARTICIPATION_AVAILABILITY.requirements}
      />
    </SurfacePage>
  );
}
