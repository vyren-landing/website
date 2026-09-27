import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";
import { PARTICIPATION_REQUIREMENTS } from "@/lib/site-features";

export default function ParticipatePage() {
  return (
    <SurfacePage
      eyebrow="Genesis / Participate"
      title="Transaction path disabled."
      description="Wallet connection, approvals, settlement, and entitlement creation are intentionally absent from the current build."
      state="BLOCKED"
    >
      <GatedPanel
        title="Participation transaction"
        description="No wallet or payment action is available in PRE-GENESIS."
        requirements={PARTICIPATION_REQUIREMENTS}
      />
    </SurfacePage>
  );
}
