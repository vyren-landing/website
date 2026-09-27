import SurfacePage from "@/components/SurfacePage";

export default function ProtocolPage() {
  return (
    <SurfacePage
      eyebrow="Protocol"
      title="Deterministic by construction."
      description="Vyren is structured around explicit execution rules and bounded authority. Public description, implementation, deployment, and live operation are treated as distinct states rather than collapsed into a single launch claim."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Explicit rules", "Core behavior is defined before demand, market pressure, or participant interaction."],
          ["Bounded authority", "Operational actors and website surfaces cannot silently acquire protocol authority."],
          ["State separation", "Architecture, implementation, deployment, evidence, participation, and activation remain independently represented."],
        ].map(([title, text]) => (
          <section key={title} className="rounded-2xl border border-zinc-900 p-6">
            <h2 className="font-medium">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
          </section>
        ))}
      </div>
    </SurfacePage>
  );
}
