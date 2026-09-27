import GatedPanel from "@/components/GatedPanel";
import SurfacePage from "@/components/SurfacePage";

export default function NetworkPage() {
  return (
    <SurfacePage
      eyebrow="Network"
      title="Live network bindings pending."
      description="Production addresses, runtime equality, finality, and monitoring will appear here only after Base Mainnet deployment evidence is established."
      state="PENDING"
    >
      <GatedPanel title="Production network" description="No production contract address set is published by this surface yet." />
    </SurfacePage>
  );
}
