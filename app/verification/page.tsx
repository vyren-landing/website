import { publicPageMetadata } from "@/lib/site-metadata";
import BindingTable from "@/components/BindingTable";
import BuildProof from "@/components/BuildProof";
import SurfacePage from "@/components/SurfacePage";
import { CANONICAL_IMPLEMENTATION, NETWORK_PROFILE, PROTOCOL_STATE } from "@/lib/site-state";

export const metadata = publicPageMetadata({
  title: "Verification",
  description: "Verification chain from canonical source and reproducible build evidence to future live-instance bindings.",
  path: "/verification",
});

const rows = [
  { label: "Canonical repository", value: CANONICAL_IMPLEMENTATION.repository },
  { label: "Canonical commit", value: CANONICAL_IMPLEMENTATION.commit, mono: true, state: "CURRENT" as const },
  { label: "Canonical tree", value: CANONICAL_IMPLEMENTATION.tree, mono: true, state: "CURRENT" as const },
  { label: "Production chain", value: `${NETWORK_PROFILE.chain} · ${NETWORK_PROFILE.chainId}`, state: NETWORK_PROFILE.state },
  { label: "Production VYREN address", value: "Pending deployment", state: "PENDING" as const },
  { label: "Runtime equality", value: "Not yet bound on mainnet", state: "PENDING" as const },
  { label: "Production profiles", value: `${PROTOCOL_STATE.productionProfilesCurrent}/${PROTOCOL_STATE.productionProfilesTotal} CURRENT`, state: "PENDING" as const },
  { label: "R2", value: "Pending / not asserted", state: PROTOCOL_STATE.r2 },
  { label: "Gate G", value: "Blocked / not asserted", state: PROTOCOL_STATE.gateG },
] as const;

export default function VerificationPage() {
  return (
    <SurfacePage
      eyebrow="Verification"
      title="From source identity to live instance."
      description="Verification is designed as a chain of evidence: canonical source, reproducible build, deployment identity, runtime equality, finalized state, monitoring freshness and dependent gates."
      state="PENDING"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <BuildProof />
        <BindingTable rows={rows} />
      </div>

      <p className="mt-8 max-w-4xl text-xs leading-6 text-zinc-600">
        A successful source build is evidence of implementation integrity. It is
        not a substitute for production deployment, runtime equality, live
        monitoring or legal readiness.
      </p>
    </SurfacePage>
  );
}
