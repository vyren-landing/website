import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function ConfirmationPage() {
  return (
    <SurfacePage
      eyebrow="Genesis / Confirmation"
      title="No settlement to confirm."
      description="This route is reserved for finalized participant evidence once Genesis is live."
      state="PENDING"
    >
      <GatedPanel
        title="Settlement confirmation"
        description="No entitlement, transaction, or settlement record exists on this website before a live canonical event is bound."
      />
    </SurfacePage>
  );
}
