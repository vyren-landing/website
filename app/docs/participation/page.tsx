import Link from "next/link";
import { publicPageMetadata } from "@/lib/site-metadata";
import StateBadge from "@/components/StateBadge";
import SurfacePage from "@/components/SurfacePage";
import { GENESIS_PROFILE } from "@/lib/site-state";

export const metadata = publicPageMetadata({
  title: "Participation Preparation",
  description:
    "Pre-Genesis VYREN participation guide separating locked protocol rules from pending legal, provider and live implementation facts.",
  path: "/docs/participation",
});

const locked = [
  ["Genesis reference", GENESIS_PROFILE.price],
  ["Minimum", GENESIS_PROFILE.minimum],
  ["Cumulative maximum", GENESIS_PROFILE.cumulativeMaximum],
  ["Vesting", GENESIS_PROFILE.vesting],
  ["Lifecycle", "PRE-GENESIS / participation closed"],
] as const;

const pending = [
  "Actual legal-person Offeror identity",
  "Actual allowed jurisdiction / participant scope",
  "Any required eligibility / KYC / sanctions implementation",
  "Actual safeguarding / payment provider",
  "Binding withdrawal / refund / cancellation wording",
  "Actual offer start and wave dates",
  "Any white-paper / notification / publication references that are actually applicable",
] as const;

const flow = [
  ["01", "Eligibility", "Actual legal and disclosure scope is evaluated."],
  ["02", "Wallet + amount", "Participant identity/binding and protocol amount bounds are checked."],
  ["03", "Safeguarded payment", "Consideration follows the approved safeguarding/payment path."],
  ["04", "Technical finality", "Relevant Base payment evidence reaches the required finalized-chain boundary."],
  ["05", "Legal finality", "Applicable withdrawal/cancellation/refund boundary is resolved."],
  ["06", "Canonical entitlement", "Deterministic VYREN entitlement is confirmed from valid evidence."],
  ["07", "GENESIS_LOCKED", "Confirmed entitlement enters the canonical locked state under vesting rules."],
  ["08", "Funds release eligibility", "Participant consideration becomes release-eligible only under the applicable legal/provider route."],
] as const;

export default function ParticipationPreparationPage() {
  return (
    <SurfacePage
      eyebrow="Documentation / Participation"
      title="Prepared flow. No open offer."
      description="This page explains the intended participation state machine without inventing external facts or enabling transactions. Locked protocol rules and pending implementation facts remain visibly separate."
      state="PENDING"
      stateLabel="PRE-GENESIS"
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium">Locked protocol rules</h2>
            <StateBadge state="CURRENT" />
          </div>
          <div className="mt-6 divide-y divide-zinc-900 border-y border-zinc-900">
            {locked.map(([label, value]) => (
              <div key={label} className="grid gap-2 py-4 text-sm md:grid-cols-[180px_1fr]">
                <span className="text-zinc-600">{label}</span>
                <span className="text-zinc-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium">Actual facts still pending</h2>
            <StateBadge state="PENDING" />
          </div>
          <ul className="mt-6 divide-y divide-zinc-900 border-y border-zinc-900">
            {pending.map((item) => (
              <li key={item} className="flex gap-3 py-4 text-sm leading-6 text-zinc-500">
                <span aria-hidden="true">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-zinc-900 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
          Intended participant state machine
        </p>
        <div className="mt-6 divide-y divide-zinc-900 border-y border-zinc-900">
          {flow.map(([index, title, detail]) => (
            <div key={index} className="grid gap-3 py-5 md:grid-cols-[56px_180px_1fr]">
              <span className="font-mono text-xs text-zinc-700">{index}</span>
              <span className="text-sm font-medium text-zinc-200">{title}</span>
              <span className="text-sm leading-6 text-zinc-500">{detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Boundary</p>
          <h2 className="mt-3 text-lg font-medium">Provider success is not entitlement.</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-500">
            Provider/custody/payment events are evidence inputs. They do not independently
            create canonical entitlement, GENESIS_LOCKED state, funds-release eligibility
            or lifecycle authority.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">GNR boundary</p>
          <h2 className="mt-3 text-lg font-medium">External implementation remains replaceable.</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-500">
            A provider, wallet, identity service or interface may implement a required result,
            but it does not become constitutional authority or erase valid canonical history
            when replaced.
          </p>
        </div>
      </section>

      <section className="mt-12 flex flex-wrap gap-3">
        <Link href="/genesis" className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white">
          Genesis overview
        </Link>
        <Link href="/status" className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white">
          Current status
        </Link>
      </section>
    </SurfacePage>
  );
}
