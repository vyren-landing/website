import BuildProof from "@/components/BuildProof";
import EvidenceLegend from "@/components/EvidenceLegend";
import SurfacePage from "@/components/SurfacePage";

export default function EvidencePage() {
  return (
    <SurfacePage
      eyebrow="Evidence"
      title="A claim is not a live state."
      description="Vyren separates design claims, implementation evidence, deployment bindings and fresh production evidence. Evidence states are explicit so a completed design cannot be mistaken for a live system."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <BuildProof />
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.18em] text-zinc-600">Evidence states</p>
          <EvidenceLegend />
        </div>
      </div>

      <section className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-3">
        {[
          ["Freshness", "Current-state evidence expires according to its defined window and may move through DUE or STALE."],
          ["Replay", "Decision-relevant evidence retains lineage so historical state transitions can be reconstructed."],
          ["Invalidation", "Runtime mismatch, scope change or failed binding can invalidate evidence immediately, regardless of age."],
        ].map(([title, text]) => (
          <div key={title} className="bg-black p-6">
            <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
          </div>
        ))}
      </section>
    </SurfacePage>
  );
}
