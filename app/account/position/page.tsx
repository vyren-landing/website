import type { Metadata } from "next";
import BindingTable from "@/components/BindingTable";
import SurfacePage from "@/components/SurfacePage";
import { GENESIS_PROFILE } from "@/lib/site-state";

export const metadata: Metadata = {
  title: "Participant Position",
  robots: { index: false, follow: false },
};

const rows = [
  { label: "Entitlement", value: "No live entitlement", state: "NOT_ASSERTED" as const },
  { label: "Vesting rule", value: GENESIS_PROFILE.vesting },
  { label: "Cliff end", value: "Not available", state: "PENDING" as const },
  { label: "Linear end", value: "Not available", state: "PENDING" as const },
  { label: "Claimed / settled", value: "No participant record", state: "PENDING" as const },
] as const;

export default function PositionPage() {
  return (
    <SurfacePage
      eyebrow="Account / Position"
      title="Position data will be evidence-bound."
      description="The account position surface will show live entitlement and vesting state only when a real participant record exists."
      state="PENDING"
    >
      <BindingTable rows={rows} />
    </SurfacePage>
  );
}
