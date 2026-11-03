import { CANONICAL_IMPLEMENTATION } from "@/lib/site-state";

const rows = [
  ["Source commit", CANONICAL_IMPLEMENTATION.commit],
  ["Foundry Build A", CANONICAL_IMPLEMENTATION.buildA],
  ["Foundry Build B", CANONICAL_IMPLEMENTATION.buildB],
  ["Static verification", CANONICAL_IMPLEMENTATION.staticVerification],
  ["Artifact equality", CANONICAL_IMPLEMENTATION.artifactEquality],
] as const;

export default function BuildProof() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#080808] p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Implementation evidence</p>
          <h2 className="mt-2 text-xl font-medium">Pinned reproducible-build baseline</h2>
        </div>
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[10px] tracking-[0.12em] text-zinc-300">
          HISTORICAL / SOURCE-SCOPED
        </span>
      </div>

      <p className="mt-4 text-xs leading-6 text-zinc-400">
        Baseline recorded 27 September 2026. These results belong to the pinned source commit below.
        They are not a full-build or product acceptance claim for later research commits.
      </p>

      <div className="mt-6 divide-y divide-zinc-900 border-y border-zinc-800">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-4 text-sm md:grid-cols-[1fr_auto]">
            <span className="text-zinc-400">{label}</span>
            <span className="break-all font-mono text-xs text-zinc-300">{value}</span>
          </div>
        ))}
      </div>
      <a
        href={`https://github.com/vyren-landing/${CANONICAL_IMPLEMENTATION.repository}/commit/${CANONICAL_IMPLEMENTATION.commit}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-xs text-orange-300 underline decoration-orange-900 underline-offset-4 hover:text-orange-200"
      >
        Inspect pinned source commit
      </a>
      <p className="mt-5 text-xs leading-6 text-zinc-500">
        Build evidence does not establish current release-wide CI, authenticated L1 finality,
        Base production state, mainnet deployment, participant rights, participation,
        market formation or activation.
      </p>
    </section>
  );
}
