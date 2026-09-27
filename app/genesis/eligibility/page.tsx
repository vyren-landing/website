import type { Metadata } from "next";
import BindingTable from "@/components/BindingTable";
import LockedAction from "@/components/LockedAction";
import SurfacePage from "@/components/SurfacePage";

export const metadata: Metadata = {
  title: "Genesis Eligibility",
  robots: { index: false, follow: false },
};

const rows = [
  { label: "Jurisdiction profile", value: "Not yet bound", state: "BLOCKED" as const },
  { label: "Offeror / PVOC", value: "Not yet bound", state: "BLOCKED" as const },
  { label: "Disclosure set", value: "Release-gated", state: "PENDING" as const },
  { label: "Eligibility provider", value: "Not yet bound", state: "PENDING" as const },
  { label: "Gate G", value: "Blocked / not asserted", state: "BLOCKED" as const },
] as const;

export default function EligibilityPage() {
  return (
    <SurfacePage
      eyebrow="Genesis / Eligibility"
      title="Eligibility is not yet evaluated."
      description="This route is reserved for the future jurisdiction, disclosure and eligibility flow. No visitor is classified as eligible or ineligible in the current PRE-GENESIS build."
      state="BLOCKED"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <BindingTable rows={rows} />
        <LockedAction
          title="Begin eligibility"
          reason="Disabled until the live legal scope, offeror, disclosures and eligibility provider are bound and current."
        />
      </div>
    </SurfacePage>
  );
}
