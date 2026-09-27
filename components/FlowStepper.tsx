import StateBadge from "@/components/StateBadge";
import type { EvidenceState } from "@/lib/site-state";

export type FlowStep = {
  index: string;
  title: string;
  detail: string;
  state: EvidenceState;
  stateLabel?: string;
};

export default function FlowStepper({ steps }: { steps: readonly FlowStep[] }) {
  return (
    <ol className="overflow-hidden rounded-2xl border border-zinc-900">
      {steps.map((step) => (
        <li
          key={step.index}
          className="grid gap-4 border-b border-zinc-900 bg-black p-5 last:border-b-0 md:grid-cols-[52px_180px_1fr_auto] md:items-center"
        >
          <span className="font-mono text-xs text-zinc-700">{step.index}</span>
          <h3 className="text-sm font-medium text-zinc-200">{step.title}</h3>
          <p className="text-sm leading-6 text-zinc-500">{step.detail}</p>
          <div>
            <StateBadge state={step.state} label={step.stateLabel} />
          </div>
        </li>
      ))}
    </ol>
  );
}
