import SurfacePage from "@/components/SurfacePage";
import StateBadge from "@/components/StateBadge";

const states = [
  ["CURRENT", "Evidence is within its required freshness and binding conditions."],
  ["DUE", "Refresh is due soon; current status has not yet expired."],
  ["STALE", "Freshness window has expired."],
  ["INVALID", "Binding, integrity, or runtime conditions failed."],
  ["PENDING", "Required live evidence has not yet been established."],
  ["BLOCKED", "A required dependency prevents the assertion."],
] as const;

export default function EvidencePage() {
  return (
    <SurfacePage
      eyebrow="Evidence"
      title="Claims and evidence are different surfaces."
      description="VYREN uses explicit evidence states so architecture or implementation progress cannot be presented as live production fact."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {states.map(([state, text]) => (
          <section key={state} className="rounded-2xl border border-zinc-900 p-6">
            <StateBadge state={state} />
            <p className="mt-4 text-sm leading-6 text-zinc-500">{text}</p>
          </section>
        ))}
      </div>
    </SurfacePage>
  );
}
