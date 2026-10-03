import type { Metadata } from "next";
import BindingTable from "@/components/BindingTable";
import SurfacePage from "@/components/SurfacePage";
import { SETTLEMENT_PROFILE } from "@/lib/site-state";

export const metadata: Metadata = {
  title: "Genesis Confirmation",
  robots: { index: false, follow: false },
};

const rows = [
  { label: "Settlement identity", value: SETTLEMENT_PROFILE.identityFormat, mono: true },
  { label: "Transaction hash", value: "No live transaction", state: "PENDING" as const },
  { label: "Log index", value: "Not available", state: "PENDING" as const },
  { label: "Technical finality", value: "Not available", state: "PENDING" as const },
  { label: "Legal finality / refund state", value: "Not available", state: "PENDING" as const },
  { label: "Canonical entitlement", value: "Not asserted", state: "NOT_ASSERTED" as const },
  { label: "GENESIS_LOCKED", value: "Not asserted", state: "NOT_ASSERTED" as const },
] as const;

export default function ConfirmationPage() {
  return (
    <SurfacePage
      eyebrow="Genesis / Confirmation"
      title="Settlement evidence will live here."
      description="A future participant confirmation is based on canonical settlement identity, technical finality, applicable legal finality and VYREN canonical state — not a provider success message alone."
      state="PENDING"
    >
      <BindingTable rows={rows} />
      <p className="mt-6 max-w-3xl text-xs leading-6 text-zinc-600">
        Provider events may support the workflow, but they do not independently
        create entitlement, GENESIS_LOCKED state, funds-release eligibility or lifecycle state.
      </p>
    </SurfacePage>
  );
}
