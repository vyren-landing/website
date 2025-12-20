export default function Problem() {
  return (
    <section className="py-28 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          What breaks early-stage token systems
        </h2>

        <p className="text-gray-300 mb-8">
          Most token ecosystems do not fail because of bad ideas. They fail
          because governance, funding, and incentives are introduced before
          clear constraints exist.
        </p>

        <ul className="space-y-4 text-gray-300 list-disc list-inside">
          <li>Manual decision-making under pressure</li>
          <li>Fragile launch and funding mechanics</li>
          <li>Incentive structures that drift over time</li>
        </ul>

        <p className="text-gray-400 mt-8">
          These conditions create systems that are difficult to govern, hard to
          scale, and vulnerable to individual actors.
        </p>
      </div>
    </section>
  );
}
