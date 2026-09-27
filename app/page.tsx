import Link from "next/link";
import StateBadge from "@/components/StateBadge";
import {
  PROTOCOL_STATE_LABEL,
  protocolStateSummary,
} from "@/lib/site-state";

const surfaces = [
  {
    title: "Protocol",
    href: "/protocol",
    text: "The protocol model, authority boundaries, and deterministic execution principles.",
  },
  {
    title: "Architecture",
    href: "/architecture",
    text: "How constitutional, economic, execution, evidence, and recovery layers are separated.",
  },
  {
    title: "Economics",
    href: "/economics",
    text: "The economic architecture and the rules that constrain value routing and participation.",
  },
  {
    title: "Lifecycle",
    href: "/lifecycle",
    text: "The state progression from architecture through deployment, Genesis, and activation.",
  },
  {
    title: "Evidence",
    href: "/evidence",
    text: "How claims are distinguished from live evidence and how freshness is represented.",
  },
  {
    title: "Documentation",
    href: "/docs",
    text: "Public disclosure surfaces derived from canonical material without replacing it.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen px-6 pb-28 pt-36 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[1400px]">
        <section className="max-w-5xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <StateBadge state="PENDING" label={PROTOCOL_STATE_LABEL} />
            <span className="text-xs text-zinc-500">
              Participation closed
            </span>
          </div>

          <h1 className="max-w-5xl text-5xl font-medium tracking-[-0.04em] md:text-7xl lg:text-8xl">
            A deterministic protocol built around explicit rules, bounded
            authority, and verifiable state.
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
            Vyren separates architecture, implementation, deployment, live
            evidence, participation, and activation. A later state is never
            presented as current before its required conditions are satisfied.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/protocol"
              className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
            >
              Explore protocol
            </Link>
            <Link
              href="/status"
              className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              View current status
            </Link>
          </div>
        </section>

        <section className="mt-24 border-y border-zinc-900 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {protocolStateSummary.map((item) => (
              <div key={item.label}>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-zinc-500">{item.label}</p>
                  <StateBadge state={item.state} />
                </div>
                <p className="mt-3 text-sm text-zinc-200">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-28">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Protocol surfaces
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2 lg:grid-cols-3">
            {surfaces.map((surface) => (
              <Link
                key={surface.href}
                href={surface.href}
                className="bg-black p-7 transition hover:bg-zinc-950"
              >
                <h2 className="text-lg font-medium">{surface.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {surface.text}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-28 grid gap-8 border-t border-zinc-900 pt-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Genesis surface
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              Built now. Opened only by state.
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-7">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium">Genesis Participation</p>
              <StateBadge state="PENDING" label="PRE-GENESIS" />
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              The participant surface is part of the final-form site
              architecture, but wallet connection and transactional actions are
              disabled until their protocol, legal, settlement, monitoring, and
              evidence dependencies are current.
            </p>
            <Link
              href="/genesis"
              className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
            >
              Inspect the locked surface
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
