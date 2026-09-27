import type { Metadata } from "next";
import SurfacePage from "@/components/SurfacePage";

export const metadata: Metadata = {
  title: "Participant Activity",
  robots: { index: false, follow: false },
};

const eventTypes = [
  ["Settlement", "Finalized payment identity and settlement evidence."],
  ["Entitlement", "Protocol-defined entitlement creation or state transition."],
  ["Vesting", "Cliff and linear-unlock state changes."],
  ["Delivery", "Any participant delivery or settlement record bound to canonical evidence."],
] as const;

export default function ActivityPage() {
  return (
    <SurfacePage
      eyebrow="Account / Activity"
      title="No synthetic transaction history."
      description="This route is designed for a future evidence-backed activity ledger. The PRE-GENESIS site intentionally shows no fake transactions or example balances."
      state="PENDING"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {eventTypes.map(([title, text]) => (
          <section key={title} className="rounded-2xl border border-zinc-900 p-6">
            <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
          </section>
        ))}
      </div>
    </SurfacePage>
  );
}
