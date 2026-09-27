import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function AccountPage() {
  return (
    <SurfacePage
      eyebrow="Account"
      title="Participant account unavailable."
      description="Account and position surfaces remain disabled until participant identity and live protocol bindings exist."
      state="BLOCKED"
    >
      <GatedPanel
        title="Participant account"
        description="There is no wallet-linked participant account in PRE-GENESIS mode."
      />
    </SurfacePage>
  );
}
