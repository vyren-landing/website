export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Autonomous Token & Launch Protocol
        </h1>

        <h2 className="text-lg md:text-xl text-gray-300 mb-10">
          Engineered for AI-Regulated, Self-Governing Economies
        </h2>

        <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-12">
          Vyren is a fully autonomous, AI-governed economic protocol with
          founder-sovereign architecture, designed to launch and sustain token
          ecosystems without human-controlled governance.
        </p>

        <div className="flex justify-center">
          <a
            href="#documentation"
            className="text-sm uppercase tracking-widest text-gray-300 border border-gray-700 px-6 py-3 hover:bg-gray-900 transition"
          >
            Documentation
          </a>
        </div>
      </div>
    </section>
  );
}
