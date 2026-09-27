import StateBadge from "@/components/StateBadge";
import type { EvidenceState } from "@/lib/site-state";

const steps: ReadonlyArray<{
  index: string;
  title: string;
  state: EvidenceState;
  label?: string;
  text: string;
}> = [
  {
    index: "01",
    title: "Architecture",
    state: "CURRENT",
    text: "Rev4.6 canonical rules and boundaries are frozen.",
  },
  {
    index: "02",
    title: "Implementation",
    state: "CURRENT",
    text: "Canonical implementation has reproducible build evidence.",
  },
  {
    index: "03",
    title: "Production Deployment",
    state: "PENDING",
    text: "Mainnet addresses and runtime equality are not yet bound.",
  },
  {
    index: "04",
    title: "Genesis",
    state: "BLOCKED",
    text: "Participation remains closed until deployment, legal and evidence gates pass.",
  },
  {
    index: "05",
    title: "Activation",
    state: "NOT_ASSERTED",
    text: "Activation follows protocol-defined thresholds, not a marketing date.",
  },
];

export default function LifecycleRail() {
  return (
    <ol className="relative">
      <div className="absolute bottom-8 left-[15px] top-8 w-px bg-zinc-900" aria-hidden="true" />
      {steps.map((step) => (
        <li key={step.index} className="relative grid gap-4 py-5 pl-12 md:grid-cols-[180px_1fr_auto] md:items-center">
          <span className="absolute left-0 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-black font-mono text-[10px] text-zinc-500">
            {step.index}
          </span>
          <h3 className="text-sm font-medium text-zinc-200">{step.title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-zinc-500">{step.text}</p>
          <div className="md:justify-self-end">
            <StateBadge state={step.state} label={step.label} />
          </div>
        </li>
      ))}
    </ol>
  );
}
