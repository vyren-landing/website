import { WP14_RESEARCH_EVIDENCE } from "@/lib/site-state";

const rows = [
  ["Research milestone", WP14_RESEARCH_EVIDENCE.milestone],
  ["Source commit", WP14_RESEARCH_EVIDENCE.sourceCommit],
  ["Scoped CI", WP14_RESEARCH_EVIDENCE.scopedResult],
  ["Test coverage", WP14_RESEARCH_EVIDENCE.scope],
  ["General F2B CI", WP14_RESEARCH_EVIDENCE.coreCiResult],
  ["Authenticated Beacon finality", WP14_RESEARCH_EVIDENCE.authenticatedBeaconFinality],
  ["Actual Base state proof", WP14_RESEARCH_EVIDENCE.realBaseStateProof],
  ["E5 and end-to-end product acceptance", WP14_RESEARCH_EVIDENCE.fullE5AndProductAcceptance],
  ["Independent R14 validation", WP14_RESEARCH_EVIDENCE.r14IndependentResult],
  ["Migration / launch authority", WP14_RESEARCH_EVIDENCE.migrationOrLaunchAuthority],
] as const;

export default function ResearchEvidence() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#080808] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">
            Later engineering research
          </p>
          <h2 className="mt-2 text-xl font-medium">WP14 R13 · Scoped test evidence</h2>
        </div>
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[10px] tracking-[0.12em] text-zinc-300">
          NOT A RELEASE PASS
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-zinc-400">
        Evidence recorded {WP14_RESEARCH_EVIDENCE.asOf}. The R13 research workflow succeeded
        on its named BLS, checkpoint and regression suites. Its live observer explicitly
        withholds authenticated Ethereum finality and any migration or launch authority.
        The separate canonical F2B workflow failed before build verification because
        pinned dependency snapshots were not restored.
      </p>

      <div className="mt-6 divide-y divide-zinc-900 border-y border-zinc-800">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-3 text-sm md:grid-cols-[210px_1fr]">
            <span className="text-xs text-zinc-500">{label}</span>
            <span className="break-words text-xs leading-6 text-zinc-300">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs">
        <a
          href={WP14_RESEARCH_EVIDENCE.researchRunUrl}
          target="_blank"
          rel="noreferrer"
          className="text-orange-300 underline decoration-orange-900 underline-offset-4 hover:text-orange-200"
        >
          Inspect R13 scoped CI result
        </a>
        <a
          href={WP14_RESEARCH_EVIDENCE.coreCiRunUrl}
          target="_blank"
          rel="noreferrer"
          className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-white"
        >
          Inspect general CI failure boundary
        </a>
      </div>

      <p className="mt-5 text-xs leading-6 text-zinc-500">
        Research test PASS is evidence about the tested routines, not about all Rev4.6
        contracts, independent Beacon finality, production deployments, full rights
        reconciliation, or real user transactions. Unverified conditions remain pending.
      </p>
    </section>
  );
}
