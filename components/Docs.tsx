const coreDocs = [
  {
    title: "Core Protocol Overview",
    note: "Protocol architecture and execution model",
  },
  {
    title: "Governance Engine (GFC-A12) — Technical Specification",
    note: "AI-regulated governance execution layer",
  },
  {
    title: "Founder Sovereign Module (FSM — Rev4.6 Ultra)",
    note: "Founder isolation and recognition framework",
  },
  {
    title: "Founder Freedom Constitution (FFA — Rev4.6)",
    note: "Immutable constitutional constraints",
  },
  {
    title: "Multi-Sig & Address Architecture (MSAA)",
    note: "Operational and custody address design",
  },
];

const economicDocs = [
  {
    title: "Tokenomics (Rev4.6 Launch-Aligned)",
    note: "Non-inflationary economic design",
  },
  {
    title: "Autopoietic Founder Reward Protocol (AFRP)",
    note: "Deterministic founder recognition mechanism",
  },
  {
    title: "FCID-0001 — Founder Contribution Specification",
    note: "Formal founder input definition",
  },
  {
    title: "AFRP Reward Function Specification (RFS-01)",
    note: "Mathematical reward function disclosure",
  },
];

export default function Docs() {
  return (
    <section
      id="documentation"
      className="py-28 px-6 bg-black border-t border-gray-900"
      aria-labelledby="documentation-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <h2
          id="documentation-heading"
          className="text-2xl md:text-3xl font-medium mb-12 text-gray-200"
        >
          Optional Documentation
        </h2>

        <div className="grid md:grid-cols-2 gap-14">
          {/* Core Protocol Documents */}
          <div>
            <h3 className="text-sm font-medium mb-6 uppercase tracking-wide text-gray-400">
              Core Protocol Documents
            </h3>

            <ul className="space-y-6">
              {coreDocs.map((doc) => (
                <li key={doc.title}>
                  <div className="text-gray-300">
                    <p className="leading-snug">{doc.title}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {doc.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Economic & Founder Papers */}
          <div>
            <h3 className="text-sm font-medium mb-6 uppercase tracking-wide text-gray-400">
              Economic & Founder Papers
            </h3>

            <ul className="space-y-6">
              {economicDocs.map((doc) => (
                <li key={doc.title}>
                  <div className="text-gray-300">
                    <p className="leading-snug">{doc.title}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {doc.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclosure Note */}
        <p className="text-xs text-gray-600 mt-16 max-w-3xl leading-relaxed">
          Documentation is provided to support independent evaluation. Public
          access to selected materials will be enabled progressively. No
          participation, allocation, or financial action is requested or
          facilitated at this stage.
        </p>
      </div>
    </section>
  );
}
