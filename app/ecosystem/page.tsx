import Link from "next/link";
import { publicPageMetadata } from "@/lib/site-metadata";
import StateBadge from "@/components/StateBadge";
import SurfacePage from "@/components/SurfacePage";

export const metadata = publicPageMetadata({
  title: "Ecosystem",
  description:
    "VYREN ecosystem capability map: DeFi, launchpad and economic infrastructure surfaces without implying live deployment or open participation.",
  path: "/ecosystem",
});

const capabilities = [
  {
    title: "DeFi",
    text: "Protocol-bound financial coordination can expose liquidity, routing, settlement and other DeFi capabilities only when their own deployment, evidence and market gates are current. No yield, pool or market is represented as live here.",
  },
  {
    title: "Launchpad",
    text: "A future launchpad surface can coordinate project discovery, disclosure, eligibility, settlement and evidence without giving the interface discretionary authority over protocol rules or participant entitlements.",
  },
  {
    title: "Economic infrastructure",
    text: "VYREN is designed to keep participant, Founder, Foundation/FOW, treasury and market-formation lanes distinct while making settlement, accounting boundaries and evidence legible.",
  },
] as const;

const userFlow = [
  ["01", "Discover", "Understand the available capability and its current state."],
  ["02", "Verify", "Check status, evidence and applicable eligibility before acting."],
  ["03", "Enter", "Use only an interface that is actually released for the current lifecycle state."],
  ["04", "Settle", "Follow the live approved settlement path without interface-side repricing or entitlement discretion."],
  ["05", "Evidence", "Receive or inspect the state and evidence produced by the applicable protocol flow."],
] as const;

export default function EcosystemPage() {
  return (
    <SurfacePage
      eyebrow="Ecosystem"
      title="Capabilities without pretending they are live."
      description="Phase-2 makes the intended VYREN ecosystem easier to understand while preserving the boundary between designed capability and current production fact."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {capabilities.map((capability) => (
          <section
            key={capability.title}
            className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-7"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-medium text-zinc-100">
                {capability.title}
              </h2>
              <StateBadge state="PENDING" label="CAPABILITY / NOT LIVE" />
            </div>
            <p className="mt-4 text-sm leading-7 text-zinc-500">
              {capability.text}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-zinc-900 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
          User path
        </p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight">
          If a capability were live, the interface should expose state before action.
        </h2>

        <div className="mt-8 divide-y divide-zinc-900 border-y border-zinc-900">
          {userFlow.map(([index, title, text]) => (
            <div
              key={index}
              className="grid gap-3 py-5 md:grid-cols-[64px_160px_1fr] md:items-start"
            >
              <span className="font-mono text-xs text-zinc-700">{index}</span>
              <p className="text-sm font-medium text-zinc-200">{title}</p>
              <p className="text-sm leading-6 text-zinc-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
            GNR boundary
          </p>
          <h2 className="mt-3 text-lg font-medium">
            Capability must not become a new lock.
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-500">
            A future provider, venue, wallet, device, interface or integration
            may implement a required result, but it should not become
            constitutional authority or an unnecessary permanent dependency.
            Replaceability and migration remain part of the design where
            feasible.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
            Current boundary
          </p>
          <h2 className="mt-3 text-lg font-medium">
            Designed capability is not current availability.
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-500">
            Genesis participation is closed. Production deployment, live DeFi
            markets, launchpad listings and transactional ecosystem surfaces are
            not asserted as current.
          </p>
        </div>
      </section>

      <section className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/protocol"
          className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          Protocol boundaries
        </Link>
        <Link
          href="/economics"
          className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          Economic model
        </Link>
        <Link
          href="/status"
          className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Current status
        </Link>
      </section>
    </SurfacePage>
  );
}
