export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white py-24">
      <div className="px-6 md:px-16 max-w-[1400px] space-y-32">

        {/* HERO */}
        <section className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Vyren is a deterministic protocol.
            <br />
            It does not launch by date. It activates by threshold.
          </h1>

          <p className="mt-6 text-sm md:text-base text-gray-400 max-w-2xl">
            Vyren operates under a finalized constitutional specification (Rev4.6).
            <br />
            All governance vectors are permanently disabled by design.
            <br />
            Execution begins only when protocol-defined conditions are met.
          </p>
        </section>

        {/* WHAT THIS IS / IS NOT */}
        <section className="grid md:grid-cols-2 gap-12 max-w-5xl">
          <div>
            <h2 className="text-lg font-medium mb-4">What Vyren Is</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>A constitutionally locked protocol architecture (Rev4.6)</li>
              <li>Deterministic economic execution</li>
              <li>Governance-free by design</li>
              <li>A lifecycle activated by thresholds, not timelines</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">What Vyren Is Not</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>A DAO</li>
              <li>A governance token</li>
              <li>A discretionary system</li>
              <li>A time-based launch</li>
            </ul>
          </div>
        </section>

        {/* ARCHITECTURE PREVIEW */}
        <section className="max-w-4xl space-y-4">
          <h2 className="text-lg font-medium">Architecture Preview</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Zero governance layer</li>
            <li>Immutable economic rules</li>
            <li>Deterministic execution paths</li>
            <li>Migration-equivalent behavior</li>
            <li>No invalid interaction surfaces</li>
          </ul>
          <p className="text-xs text-gray-500">
            Full architectural documentation exists and is locked under Rev4.6.
          </p>
        </section>

        {/* ECONOMIC PARTICIPATION */}
        <section className="max-w-4xl space-y-4">
          <h2 className="text-lg font-medium">Economic Participation (Preview)</h2>
          <p className="text-gray-400 text-sm max-w-3xl">
            Vyren does not distribute tokens through discretionary sales.
            Economic participation is governed by deterministic,
            protocol-level rules and activates only after predefined
            thresholds are satisfied.
          </p>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>No allocations</li>
            <li>No vesting schedules</li>
            <li>No preferential terms</li>
          </ul>
        </section>

        {/* STATUS */}
        <section className="max-w-4xl border border-gray-800 p-6 text-sm space-y-2">
          <p><strong>Protocol Status</strong></p>
          <p>Architecture: Final (Rev4.6)</p>
          <p>Documentation: Locked</p>
          <p>Participation: Enabled by design</p>
          <p>Execut
