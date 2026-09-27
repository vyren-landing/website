import StateBadge from "@/components/StateBadge";
import type { EvidenceState } from "@/lib/site-state";

export type BindingRow = {
  label: string;
  value: string;
  state?: EvidenceState;
  mono?: boolean;
};

export default function BindingTable({ rows }: { rows: readonly BindingRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-900">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-3 border-b border-zinc-900 bg-black p-5 last:border-b-0 md:grid-cols-[210px_1fr_auto] md:items-center"
        >
          <p className="text-xs text-zinc-600">{row.label}</p>
          <p className={row.mono ? "break-all font-mono text-xs text-zinc-300" : "text-sm text-zinc-300"}>
            {row.value}
          </p>
          {row.state ? <StateBadge state={row.state} /> : null}
        </div>
      ))}
    </div>
  );
}
