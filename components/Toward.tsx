export default function Toward() {
  return (
    <section className="py-28 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          What we are building toward
        </h2>

        <p className="text-gray-300 mb-8">
          If these constraints hold, economic systems can evolve with greater
          predictability and resilience.
        </p>

        <ul className="space-y-4 text-gray-300 list-disc list-inside">
          <li>Less dependent on individual actors</li>
          <li>More stable under growth and pressure</li>
          <li>Easier to reason about over long time horizons</li>
        </ul>

        <p className="text-gray-400 mt-8">
          This includes decentralized financial primitives, token-based
          coordination mechanisms, and autonomous launch and participation
          frameworks.
        </p>

        <p className="text-gray-500 mt-6">
          This is not a promise of outcomes, but a design objective.
        </p>
      </div>
    </section>
  );
}
