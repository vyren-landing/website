import StateBadge from "@/components/StateBadge";
import type { EvidenceState } from "@/lib/site-state";

const states: ReadonlyArray<{
  state: EvidenceState;
  text: string;
}> = [
  { state: "CURRENT", text: "Required binding and freshness conditions are satisfied." },
  { state: "DUE", text: "Refresh is due before the current window expires." },
  { state: "STALE", text: "Freshness window has expired." },
  { state: "INVALID", text: "Integrity, runtime or binding conditions failed." },
  { state: "PENDING", text: "Required live evidence has not yet been established." },
  { state: "BLOCKED", text: "A prerequisite prevents the assertion from progressing." },
];

export default function EvidenceLegend() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2">
      {states.map((item) => (
        <div key={item.state} className="bg-black p-5">
          <StateBadge state={item.state} />
          <p className="mt-4 text-sm leading-6 text-zinc-500">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
