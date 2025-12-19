const architectureItems = [
  {
    title: "GFC-A12 Autonomous Governance Engine",
    description:
      "AI-regulated, immutable governance execution layer operating without discretionary human control.",
  },
  {
    title: "ACE-Mesh Economic Routing Infrastructure",
    description:
      "Autonomous treasury and economic flow routing fabric enabling deterministic value distribution.",
  },
  {
    title: "Founder Sovereign Module (FSM)",
    description:
      "Rev4.6 Ultra Standard constitutional layer isolating founders from governance authority while preserving protocol-level recognition.",
  },
  {
    title: "Autopoietic Founder Reward Protocol (AFRP) — Elastic Model",
    description:
      "Non-inflationary, deterministic founder recognition mechanism embedded directly at protocol level.",
  },
  {
    title: "Autonomous Launch & Funding Lifecycle (ALF-L1)",
    description:
      "Self-governing, trust-minimized token launch and funding architecture.",
  },
];

export default function Architecture() {
  return (
    <section className="py-28 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">
          Core Architecture
        </h2>

        <div className="space-y-10">
          {architectureItems.map((item) => (
            <div key={item.title}>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 max-w-3xl">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
