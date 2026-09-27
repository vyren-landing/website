import Link from "next/link";
import BuildProof from "@/components/BuildProof";
import EconomicAnchors from "@/components/EconomicAnchors";
import LifecycleRail from "@/components/LifecycleRail";
import ProtocolMap from "@/components/ProtocolMap";
import StateBadge from "@/components/StateBadge";
import {
  PROTOCOL_STATE_LABEL,
  protocolStateSummary,
} from "@/lib/site-state";

const surfaces = [
  { title: "Protocol", href: "/protocol", text: "Rule boundaries, authority separation and deterministic execution." },
  { title: "Architecture", href: "/architecture", text: "How constitutional, economic, execution, evidence and public layers remain distinct." },
  { title: "Economics", href: "/economics", text: "Locked numerical anchors and the separation of participant, founder and protocol flows." },
  { title: "Evidence", href: "/evidence", text: "Freshness, verification and the difference between implementation evidence and live production fact." },
  { title: "Documentation", href: "/docs", text: "Public disclosure derived from canonical material without replacing it." },
  { title: "Status", href: "/status", text: "What is verifiably true now, and what remains pending or blocked." },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen px-6 pb-28 pt-36 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[1400px]">
        <section className="relative overflow-hidden rounded-[32px] border border-zinc-900 bg-[#080808] px-6 py-12 md:px-10 md:py-16">
          <div className="protocol-grid absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative max-w-5xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <StateBadge state="PENDING" label={PROTOCOL_STATE_LABEL} />
              <span className="text-xs text-zinc-500">Participation closed</span>
            </div>

            <h1 className="max-w-5xl text-5xl font-medium tracking-[-0.045em] md:text-7xl lg:text-8xl">
              Explicit rules.
              <br />
              Bounded authority.
              <br />
              Verifiable state.
            </h1>

            <p className="mt-8 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
              Vyren is a deterministic protocol architecture designed so that
              architecture, implementation, deployment, evidence, participation
              and activation remain separate states. A later state is never
              presented as current before its required conditions are satisfied.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/protocol" className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white">
                Explore protocol
              </Link>
              <Link href="/status" className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white">
                View current status
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2 lg:grid-cols-4">
          {protocolStateSummary.map((item) => (
            <div key={item.label} className="bg-black p-6">
              <div className="flex items-center gap-2">
                <p className="text-xs text-zinc-500">{item.label}</p>
                <StateBadge state={item.state} />
              </div>
              <p className="mt-3 text-sm text-zinc-200">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Protocol model</p>
            <h2 className="mt-4 max-w-md text-3xl font-medium tracking-tight md:text-4xl">
              The website mirrors the protocol state. It does not create it.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500">
              Public disclosure, participant interfaces and operational tooling
              are deliberately separated from canonical protocol authority.
            </p>
          </div>
          <ProtocolMap />
        </section>

        <section className="mt-24">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Locked economic anchors</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">Numbers without a sale surface.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Core Rev4.6 numerical anchors can be disclosed while Genesis
              remains closed. Their presence on the website is informational,
              not an invitation or execution path.
            </p>
          </div>
          <EconomicAnchors />
        </section>

        <section className="mt-24 grid gap-8 lg:grid-cols-2">
          <BuildProof />
          <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Current boundary</p>
            <h2 className="mt-3 text-xl font-medium">Pre-live tooling is not live production evidence.</h2>
            <p className="mt-5 text-sm leading-7 text-zinc-500">
              Production profiles remain 0/10 CURRENT. R2 is pending and Gate G
              remains blocked / not asserted. Mainnet addresses, live market
              formation, participant settlement and activation are not presented
              as current.
            </p>
            <Link href="/status" className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300">
              Inspect current status
            </Link>
          </div>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Lifecycle</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">Thresholds, not a countdown.</h2>
          </div>
          <div className="rounded-2xl border border-zinc-900 px-6 py-2">
            <LifecycleRail />
          </div>
        </section>

        <section className="mt-24">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Explore</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2 lg:grid-cols-3">
            {surfaces.map((surface) => (
              <Link key={surface.href} href={surface.href} className="group bg-black p-7 transition hover:bg-zinc-950">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-medium">{surface.title}</h2>
                  <span className="text-zinc-700 transition group-hover:text-zinc-400">↗</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{surface.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-[28px] border border-zinc-900 bg-[#080808] p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Genesis interface</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight">Built now. Opened only by state.</h2>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium">Genesis Participation</p>
                <StateBadge state="PENDING" label="PRE-GENESIS" />
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-500">
                The participant surface is part of the final-form site
                architecture, but wallet connection and transactional actions are
                disabled until their protocol, legal, settlement, monitoring and
                evidence dependencies are current.
              </p>
              <Link href="/genesis" className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300">
                Inspect the locked surface
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
