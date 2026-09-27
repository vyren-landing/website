import SurfacePage from "@/components/SurfacePage";
import StateBadge from "@/components/StateBadge";

const steps = [
  ["Architecture", "CURRENT"],
  ["Implementation", "CURRENT"],
  ["Production deployment", "PENDING"],
  ["Genesis", "PENDING"],
  ["Activation preparation", "PENDING"],
  ["Active", "NOT_ASSERTED"],
] as const;

export default function LifecyclePage() {
  return (
    <SurfacePage
      eyebrow="Lifecycle"
      title="Later states are not treated as current."
      description="Vyren progresses by state and evidence. The website mirrors that progression without creating it."
    >
      <div className="max-w-3xl">
        {steps.map(([label, state], index) => (
          <div key={label} className="flex items-center gap-4 border-b border-zinc-900 py-5">
            <span className="w-8 text-xs text-zinc-600">0{index + 1}</span>
            <span className="flex-1 text-sm text-zinc-200">{label}</span>
            <StateBadge state={state} />
          </div>
        ))}
      </div>
    </SurfacePage>
  );
}
