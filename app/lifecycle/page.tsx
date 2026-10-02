import { publicPageMetadata } from "@/lib/site-metadata";
import LifecycleRail from "@/components/LifecycleRail";
import SurfacePage from "@/components/SurfacePage";

export const metadata = publicPageMetadata({
  title: "Lifecycle",
  description: "VYREN progresses by state and evidence rather than a marketing countdown or launch date.",
  path: "/lifecycle",
});

export default function LifecyclePage() {
  return (
    <SurfacePage
      eyebrow="Lifecycle"
      title="Progression by state, not marketing date."
      description="Vyren treats architecture, implementation, production deployment, Genesis and activation as separate states. Each later state requires its own prerequisites and evidence."
    >
      <div className="rounded-2xl border border-zinc-900 px-6 py-2 md:px-8">
        <LifecycleRail />
      </div>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-900 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Genesis</p>
          <h2 className="mt-3 text-lg font-medium">Not a countdown event.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Participation opens only after the applicable G-GENESIS legal,
            safeguarding, settlement, public-surface and minimum security
            conditions are current. Production deployment is not treated as a
            universal legal pre-Genesis requirement.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-900 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Activation</p>
          <h2 className="mt-3 text-lg font-medium">Threshold-bound.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Rev4.6 activation uses protocol-defined thresholds including QAD,
            clean / ABF handling, R2-ACTIVATION, G-ACTIVE, ASCF and F3 rather
            than a promotional date. MARKET OPEN remains a separate path.
          </p>
        </div>
      </section>
    </SurfacePage>
  );
}
