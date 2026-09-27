import type { Metadata } from "next";
import LockedAction from "@/components/LockedAction";
import StateBadge from "@/components/StateBadge";
import SurfacePage from "@/components/SurfacePage";

export const metadata: Metadata = {
  title: "Participant Account",
  robots: { index: false, follow: false },
};

const cards = [
  ["Genesis entitlement", "—", "NOT_ASSERTED" as const],
  ["Locked balance", "—", "PENDING" as const],
  ["Unlocked balance", "—", "PENDING" as const],
  ["Next vesting event", "—", "PENDING" as const],
] as const;

export default function AccountPage() {
  return (
    <SurfacePage
      eyebrow="Account"
      title="Participant dashboard reserved."
      description="The final-form account surface is present, but no wallet identity, entitlement, balance or vesting position is fabricated before live Genesis data exists."
      state="BLOCKED"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, state]) => (
          <div key={label} className="rounded-2xl border border-zinc-900 bg-[#080808] p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-zinc-600">{label}</p>
              <StateBadge state={state} />
            </div>
            <p className="mt-5 text-2xl text-zinc-500">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 max-w-md">
        <LockedAction
          title="Connect participant wallet"
          reason="Account identity is unavailable until the wallet surface is released and a live participant state exists."
        />
      </div>
    </SurfacePage>
  );
}
