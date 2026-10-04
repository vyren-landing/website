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
  { title: "Ecosystem", href: "/ecosystem", text: "DeFi, launchpad and economic-infrastructure capabilities without confusing design with live availability." },
  { title: "Economics", href: "/economics", text: "Locked numerical anchors and the separation of participant, founder and protocol flows." },
  { title: "Evidence", href: "/evidence", text: "Freshness, verification and the difference between implementation evidence and live production fact." },
  { title: "Documentation", href: "/docs", text: "Public disclosure derived from canonical material without replacing it." },
  { title: "Status", href: "/status", text: "What is verifiably true now, and what remains pending or blocked." },
] as const;

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen scroll-mt-24 px-6 pb-28 pt-28 md:px-10 md:pt-32 lg:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <section className="relative overflow-hidden rounded-[32px] border border-zinc-900 bg-[#080808] px-6 py-12 md:px-10 md:py-16">
          <div className="protocol-grid absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative max-w-5xl" id="c0-site-01-hero" data-content-id="C0-SITE-01-HERO">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <StateBadge state="PENDING" label="PRE-GENESIS" />
              <span className="text-xs text-zinc-500">Participation closed</span>
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">VYREN · PRE-GENESIS</p>

            <h1 className="mt-5 max-w-5xl text-5xl font-medium tracking-[-0.045em] md:text-7xl lg:text-8xl">
              Economic infrastructure should make state, rights and execution clear before action.
            </h1>

            <p className="mt-8 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
              VYREN is being built as a deterministic protocol architecture for
              DeFi, launchpad and broader economic coordination — separating
              participation, protocol activation and market access instead of
              collapsing them into one promise.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/protocol"
                data-content-id="C0-SITE-01-HERO"
                data-cta-id="explore-vyren"
                className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
              >
                Explore VYREN
              </Link>
              <Link
                href="/status"
                data-content-id="C0-SITE-01-HERO"
                data-cta-id="view-current-status"
                className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                View current status
              </Link>
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.14em] text-zinc-600">
              PRE-GENESIS · Participation closed · Production deployment pending
            </p>
          </div>
        </section>

        <section className="mt-8" id="c0-site-01-proof" data-content-id="C0-SITE-01-PROOF">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Reproducible implementation evidence</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
                From thesis to verifiable state — without presenting pending work as live.
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                The core architecture and canonical build baseline can be verified today.
                Production deployment, Genesis participation and activation remain separate pending states.
              </p>
            </div>
            <Link
              href="/verification"
              data-content-id="C0-SITE-01-PROOF"
              data-cta-id="inspect-verification"
              className="text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
            >
              Inspect verification
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2 lg:grid-cols-4">
            {protocolStateSummary.map((item) => (
              <div key={item.label} className="bg-black p-6">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-zinc-500">{item.label}</p>
                  <StateBadge state={item.state} />
                </div>
                <p className="mt-3 text-sm text-zinc-200">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-16 rounded-[28px] border border-zinc-900 bg-[#080808] p-7 md:p-10"
          id="c0-site-01-ecosystem"
          data-content-id="C0-SITE-01-ECOSYSTEM"
        >
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Why VYREN</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                One system. Distinct states. Fewer hidden assumptions.
              </h2>
              <p className="mt-5 text-sm leading-7 text-zinc-500">
                Crypto products often blur architecture, participation, activation
                and market access into a single narrative. VYREN is designed to
                keep those states separate and evidence-bound.
              </p>
              <p className="mt-4 text-sm leading-7 text-zinc-500">
                That separation matters because a public interface should not make
                a pending capability look live, turn a provider into protocol
                authority, or treat market availability as proof that the
                underlying system is ready.
              </p>
              <Link
                href="/ecosystem"
                data-content-id="C0-SITE-01-ECOSYSTEM"
                data-cta-id="see-how-vyren-works"
                className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
              >
                See how VYREN works
              </Link>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-3">
              {[
                [
                  "DeFi",
                  "State-aware financial and settlement capabilities that become available only when their own deployment, evidence and market conditions are current.",
                ],
                [
                  "Launchpad",
                  "A future participation surface designed around disclosure, eligibility, settlement and evidence without giving the interface discretionary control over protocol rules or participant entitlements.",
                ],
                [
                  "Economic infrastructure",
                  "Separated participant, Founder/FOW, treasury and market lanes with clearer settlement, accounting and evidence boundaries.",
                ],
              ].map(([title, text]) => (
                <div key={title} className="bg-black p-6">
                  <p className="text-sm font-medium text-zinc-200">{title}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
                  <p className="mt-5 text-[10px] tracking-[0.12em] text-zinc-700">CAPABILITY / NOT LIVE</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 rounded-[28px] border border-zinc-900 bg-[#080808] p-7 md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Current phase</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              The architecture is defined. The remaining work is narrower.
            </h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-zinc-400">
              Vyren is now working through final pre-Genesis implementation,
              evidence, legal-provider readiness and production-binding stages.
              Public participation remains closed, production deployment is not
              asserted, and activation remains state-dependent.
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Public updates are resuming because the system is now concrete
              enough to show more of how its rules, boundaries and evidence model
              behave under real constraints.
            </p>
          </div>
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

        <section className="mt-24 rounded-[28px] border border-zinc-900 bg-[#080808] p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Ecosystem direction</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight">
                DeFi, launchpad and economic infrastructure — separated by state.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-500">
                Phase-2 exposes what the broader VYREN ecosystem is intended to
                support without presenting future capability as current product
                availability.
              </p>
              <Link href="/ecosystem" className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300">
                Explore ecosystem
              </Link>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-3">
              {[
                ["DeFi", "State-aware financial and settlement capabilities."],
                ["Launchpad", "Disclosure, eligibility and settlement surfaces for future project participation."],
                ["Economic infrastructure", "Separated participant, Founder, Foundation/FOW, treasury and market lanes."],
              ].map(([title, text]) => (
                <div key={title} className="bg-black p-6">
                  <p className="text-sm font-medium text-zinc-200">{title}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
                  <p className="mt-5 text-[10px] tracking-[0.12em] text-zinc-700">CAPABILITY / NOT LIVE</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-8 lg:grid-cols-2">
          <BuildProof />
          <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Current boundary</p>
            <h2 className="mt-3 text-xl font-medium">Pre-live tooling is not live production evidence.</h2>
            <p className="mt-5 text-sm leading-7 text-zinc-500">
              Production maturity remains incomplete and R2 is pending.
              G-GENESIS, G-ACTIVE and G-MARKET are evaluated separately at the
              points where their evidence is actually required. Mainnet
              addresses, participant settlement, live market formation and
              activation are not presented as current.
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
          <div className="mb-8 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Architecture fragments</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              Small pieces of a much larger rule system.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-500">
              Selected concepts can be public without collapsing the full
              canonical architecture into a single disclosure surface.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Qualified Activation Days", "Activation readiness accumulates through qualified state, not a calendar countdown."],
              ["PENDING_DELIVERY ≠ cancellation", "A delivery constraint does not rewrite a valid computed settlement."],
              ["Economic right ≠ governance authority", "Economic entitlement does not create protocol control."],
              ["Evidence can become DUE or STALE", "A past review does not remain current simply because it exists."],
              ["Recovery ≠ rewriting history", "Canonical recovery restores valid execution rather than creating a discretionary reset."],
            ].map(([title, text]) => (
              <div key={title} className="bg-black p-7">
                <p className="text-sm font-medium text-zinc-200">{title}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
              </div>
            ))}
            <div className="bg-[#080808] p-7">
              <p className="text-sm font-medium text-zinc-300">More will become visible.</p>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Additional architecture will be disclosed as final pre-Genesis
                work advances and its release conditions are satisfied.
              </p>
            </div>
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
