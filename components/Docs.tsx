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
        <h2
          id="documentation-heading"
          className="text-3xl md:text-4xl font-semibold mb-12"
        >
          Documentation
        </h2>

        <div className="grid md:grid-cols-2 gap-14">
          {/* Core Protocol Documents */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-gray-200">
              Core Protocol Documents
            </h3>

            <ul className="space-y-5">
              {coreDocs.map((doc) => (
                <li key={doc.title}>
                  <div className="text-gray-300">
                    <p className="leading-snug">{doc.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {doc.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Economic & Founder Papers */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-gray-200">
              Economic & Founder Papers
            </h3>

            <ul className="space-y-5">
              {economicDocs.map((doc) => (
                <li key={doc.title}>
                  <div className="text-gray-300">
                    <p className="leading-snug">{doc.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {doc.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-16 max-w-3xl">
          Public access to selected documents will be enabled progressively.
          No participation, allocation, or financial action is requested or
          facilitated at this stage.
        </p>
      </div>
    </section>
  );
}
