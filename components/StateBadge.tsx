import type { EvidenceState } from "@/lib/site-state";

const stateClasses: Record<EvidenceState, string> = {
  CURRENT: "border-emerald-900/70 bg-emerald-950/40 text-emerald-300",
  DUE: "border-amber-900/70 bg-amber-950/40 text-amber-300",
  STALE: "border-orange-900/70 bg-orange-950/40 text-orange-300",
  INVALID: "border-red-900/70 bg-red-950/40 text-red-300",
  PENDING: "border-zinc-700 bg-zinc-900 text-zinc-300",
  BLOCKED: "border-red-900/60 bg-red-950/30 text-red-300",
  NOT_ASSERTED: "border-zinc-700 bg-zinc-900 text-zinc-400",
};

export default function StateBadge({
  state,
  label,
}: {
  state: EvidenceState;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] ${stateClasses[state]}`}
    >
      {label ?? state.replaceAll("_", " ")}
    </span>
  );
}
