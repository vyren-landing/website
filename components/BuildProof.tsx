import StateBadge from "@/components/StateBadge";

const rows = [
  ["Canonical source", "6559e4cd…a59282"],
  ["Foundry Build A", "59 / 59 PASS"],
  ["Foundry Build B", "59 / 59 PASS"],
  ["Static verification", "220 / 220 PASS"],
  ["Artifact equality", "82 / 82"],
] as const;

export default function BuildProof() {
  return (
    <section className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Implementation evidence</p>
          <h2 className="mt-2 text-xl font-medium">Reproducible build baseline</h2>
        </div>
        <StateBadge state="CURRENT" label="BUILD VERIFIED" />
      </div>

      <div className="mt-8 divide-y divide-zinc-900 border-y border-zinc-900">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-4 text-sm md:grid-cols-[1fr_auto]">
            <span className="text-zinc-500">{label}</span>
            <span className="font-mono text-xs text-zinc-300">{value}</span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-zinc-600">
        Build evidence does not imply production deployment, live addresses,
        participation, market formation or activation.
      </p>
    </section>
  );
}
