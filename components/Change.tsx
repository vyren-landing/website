export default function Change() {
  return (
    <section className="py-28 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          What Vyren is designed to change
        </h2>

        <p className="text-gray-300 mb-8">
          Vyren restructures early-stage systems around deterministic rules
          rather than discretionary decisions.
        </p>

        <ul className="space-y-4 text-gray-300 list-disc list-inside">
          <li>Governance execution without ad-hoc intervention</li>
          <li>Predictable treasury and value routing</li>
          <li>Participation frameworks defined before demand exists</li>
        </ul>

        <p className="text-gray-400 mt-8">
          The goal is not to eliminate human involvement, but to remove fragile
          control paths from system-critical decisions.
        </p>
      </div>
    </section>
  );
}
