const statusItems = [
  "Founder Freedom Architecture (FFA) — Rev4.6 completed",
  "Founder Sovereign Module (FSM) — Ultra Standard finalized",
  "Multi-Sig & Address Architecture (MSAA) — finalized",
  "Governance Stack (GFC-A12, IRF, FEC) — operational",
  "Autopoietic Founder Reward Protocol (AFRP) — Elastic Model integrated",
  "Autonomous Launch & Funding Lifecycle (ALF-L1) — ready",
];

export default function Status() {
  return (
    <section className="py-28 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          Protocol Status
        </h2>

        <ul className="space-y-4 text-gray-300 text-base md:text-lg">
          {statusItems.map((item) => (
            <li key={item} className="flex items-start">
              <span className="mr-3 text-green-400">✔</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
