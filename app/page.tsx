import Link from "next/link";
import ProtocolMap from "@/components/ProtocolMap";
import StateBadge from "@/components/StateBadge";
import { protocolStateSummary } from "@/lib/site-state";

const surfaces = [
  { title: "Protocol", href: "/protocol", text: "Rule boundaries, bounded authority and deterministic execution." },
  { title: "Architecture", href: "/architecture", text: "How constitutional, economic, execution, evidence and public responsibilities remain distinct." },
  { title: "Ecosystem", href: "/ecosystem", text: "Future DeFi, launch infrastructure and broader economic capabilities, clearly separated from live availability." },
  { title: "Economics", href: "/economics", text: "Locked numerical anchors and separate economic domains." },
  { title: "Evidence", href: "/evidence", text: "Freshness, verification and the difference between implementation evidence and live production fact." },
  { title: "Lifecycle", href: "/lifecycle", text: "Genesis, activation and market access as distinct evidence-based states." },
  { title: "Documentation", href: "/docs", text: "Public disclosure derived from canonical material without replacing it." },
  { title: "Status", href: "/status", text: "What is verifiably true now and what remains pending." },
] as const;

const utility = [
  {
    title: "DeFi coordination",
    text: "Financial, routing and settlement capabilities operating within explicit authority and evidence boundaries.",
    state: "FUTURE CAPABILITY / NOT LIVE",
  },
  {
    title: "Launch infrastructure",
    text: "Project discovery, disclosure, eligibility and settlement without giving the interface discretionary control over protocol rules or participant entitlement.",
    state: "FUTURE CAPABILITY / NOT LIVE",
  },
  {
    title: "Economic execution and settlement",
    text: "Structured transfer, settlement, escrow and related economic flows with clearer state and evidence boundaries.",
    state: "FUTURE CAPABILITY / NOT LIVE",
  },
  {
    title: "Agent and payment execution",
    text: "Future machine-driven economic actions operating inside defined capability and authority limits.",
    state: "BEING EXPLORED / NOT LIVE",
  },
] as const;

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen scroll-mt-24 px-6 pb-28 pt-28 md:px-10 md:pt-32 lg:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <section className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-[#080808] px-6 py-12 md:px-10 md:py-16">
          <div className="protocol-grid absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative max-w-5xl" id="c0-site-01-hero" data-content-id="C0-SITE-01-HERO">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <StateBadge state="PENDING" label="PRE-GENESIS" />
              <span className="text-xs text-zinc-500">Genesis participation not open</span>
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">VYREN · PRE-GENESIS</p>

            <h1 className="mt-5 max-w-5xl text-5xl font-medium tracking-[-0.045em] md:text-7xl lg:text-8xl">
              BUILD THE RULES BEFORE THE MARKET TESTS THEM.
            </h1>

            <p className="mt-8 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
              VYREN is developing deterministic economic infrastructure for DeFi,
              launch infrastructure and broader economic coordination, designed
              around explicit rules, bounded authority and verifiable state.
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

            <p className="mt-5 text-xs uppercase tracking-[0.14em] text-zinc-500">
              PRE-GENESIS · GENESIS PARTICIPATION NOT OPEN · PRODUCTION DEPLOYMENT PENDING
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-8 rounded-[28px] border border-zinc-800 bg-[#080808] p-7 lg:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">The problem</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              The hardest rules are often discovered too late.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-zinc-300">
            <p>
              Crypto systems can blur architecture, participation, activation and
              market access into one story.
            </p>
            <p>
              That becomes a problem when money starts moving, providers fail,
              evidence changes or operational actors gain more authority than the
              system intended.
            </p>
            <p className="text-zinc-300">
              VYREN is designed to make those boundaries explicit before market pressure arrives.
            </p>
          </div>
        </section>

        <section className="mt-16" id="c0-site-01-approach" data-content-id="C0-SITE-01-APPROACH">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Why it matters</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              Define the rules. Bound the authority. Verify the state.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              The goal is not to eliminate real-world operations. The goal is to
              prevent an implementation, provider, interface or future capability
              from quietly becoming the source of protocol authority.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:grid-cols-3">
            {[
              ["Authority", "Who can do what, and what can they never control?"],
              ["Execution", "Which defined rule determines the outcome?"],
              ["Verification", "What evidence proves the system's current state?"],
            ].map(([title, text]) => (
              <div key={title} className="bg-black p-7">
                <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-24 rounded-[28px] border border-zinc-800 bg-[#080808] p-7 md:p-10"
          id="c0-site-01-ecosystem"
          data-content-id="C0-SITE-01-ECOSYSTEM"
        >
          <div className="mb-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Practical direction</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              What can this architecture become useful for?
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              VYREN is being designed as infrastructure that can support multiple
              economic capability layers. These directions are not presented as live products.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:grid-cols-2">
            {utility.map((item) => (
              <div key={item.title} className="bg-black p-7">
                <h3 className="text-sm font-medium text-zinc-200">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{item.text}</p>
                <p className="mt-5 text-[10px] tracking-[0.12em] text-zinc-500">{item.state}</p>
              </div>
            ))}
          </div>

          <Link
            href="/ecosystem"
            data-content-id="C0-SITE-01-ECOSYSTEM"
            data-cta-id="explore-ecosystem"
            className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
          >
            Explore ecosystem direction
          </Link>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Architecture</p>
            <h2 className="mt-4 max-w-md text-3xl font-medium tracking-tight md:text-4xl">
              Understanding the architecture through five responsibilities.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-300">
              This is a public communication map of responsibilities, not a new
              constitutional taxonomy. The website describes system state and
              boundaries without becoming protocol authority.
            </p>
            <Link
              href="/architecture"
              className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
            >
              Explore architecture
            </Link>
          </div>
          <ProtocolMap />
        </section>

        <section className="mt-24" id="c0-site-01-proof" data-content-id="C0-SITE-01-PROOF">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Current proof and state</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              Built state should be visible. Pending state should remain pending.
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              VYREN separates architecture, implementation, production deployment,
              Genesis, activation and market access so one state cannot be mistaken for another.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:grid-cols-2 lg:grid-cols-4">
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

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-[#080808] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Activation</p>
              <p className="mt-3 text-sm text-zinc-300">NOT ASSERTED</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">ACTIVE/TGE has not occurred.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#080808] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Genesis participation</p>
              <p className="mt-3 text-sm text-zinc-300">NOT OPEN</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">G-GENESIS remains evidence-pending.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#080808] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Market access</p>
              <p className="mt-3 text-sm text-zinc-300">NOT ASSERTED</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">MARKET OPEN is a separate lifecycle state.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/status"
              data-content-id="C0-SITE-01-PROOF"
              data-cta-id="view-project-status"
              className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
            >
              View project status
            </Link>
            <Link
              href="/evidence"
              data-content-id="C0-SITE-01-PROOF"
              data-cta-id="inspect-evidence"
              className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              Inspect evidence
            </Link>
          </div>
        </section>

        <section className="mt-24 rounded-[28px] border border-zinc-800 bg-[#080808] p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">State discipline</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight">
                A completed design does not imply a live system.
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-7 text-zinc-300">
              <p>A future capability does not imply a current product.</p>
              <p>A public interface does not create protocol authority.</p>
              <p>ACTIVE/TGE does not automatically mean MARKET OPEN.</p>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Go deeper</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:grid-cols-2 lg:grid-cols-4">
            {surfaces.map((surface) => (
              <Link key={surface.href} href={surface.href} className="group bg-black p-7 transition hover:bg-zinc-950">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-medium">{surface.title}</h2>
                  <span className="text-zinc-500 transition group-hover:text-zinc-300">↗</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{surface.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-[28px] border border-zinc-800 bg-[#080808] p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Genesis</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight">
                Prepared now. Opened only by state.
              </h2>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium">Genesis Participation</p>
                <StateBadge state="PENDING" label="NOT OPEN" />
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                The participant surface is part of the final-form site architecture,
                but transactional actions remain disabled until the applicable
                legal, safeguarding, settlement, security and public-surface evidence is current.
              </p>
              <Link href="/genesis" className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300">
                Explore Genesis preparation
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
