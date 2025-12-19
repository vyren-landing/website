const coreDocs = [
  "Core Protocol Overview",
  "Governance Engine (GFC-A12) — Technical Specification",
  "Founder Sovereign Module (FSM — Rev4.6 Ultra)",
  "Founder Freedom Constitution (FFA — Rev4.6)",
  "Multi-Sig & Address Architecture (MSAA)",
];

const economicDocs = [
  "Tokenomics (Rev4.6 Launch-Aligned)",
  "Autopoietic Founder Reward Protocol (AFRP)",
  "FCID-0001 — Founder Contribution Specification",
  "AFRP Reward Function Specification (RFS-01)",
];

export default function Docs() {
  return (
    <section id="documentation" className="py-28 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">
          Documentation
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-medium mb-6">
              Core Protocol Documents
            </h3>
            <ul className="space-y-3 text-gray-300">
              {coreDocs.map((doc) => (
                <li key={doc}>
                  <span className="hover:underline cursor-default">
                    {doc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6">
              Economic & Founder Papers
            </h3>
            <ul className="space-y-3 text-gray-300">
              {economicDocs.map((doc) => (
                <li key={doc}>
                  <span className="hover:underline cursor-default">
                    {doc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
