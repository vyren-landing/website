export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-black">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6">
          Autonomous Token & Launch Protocol
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-6">
          Designed to remove fragile decision-making from early-stage systems.
        </p>

        <p className="text-base text-gray-400 max-w-3xl mx-auto">
          Vyren is an autonomous protocol focused on redesigning how on-chain
          economic systems are launched, governed, and sustained — without
          reliance on discretionary human control.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Current phase: architecture validation and test iterations.
        </p>
      </div>
    </section>
  );
}
