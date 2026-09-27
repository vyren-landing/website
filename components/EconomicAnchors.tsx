const anchors = [
  ["Total supply", "300M VYREN", "MF 30M · GP 90M · LHE 180M"],
  ["Genesis reference", "USD 0.025 / VYREN", "Locked protocol anchor · participation closed"],
  ["Participation bounds", "5,000 — 100,000 VYREN", "Minimum · cumulative maximum"],
  ["Vesting", "90-day cliff", "+ 12 calendar months linear"],
  ["Activation", "≥30 QAD", "+ ABF / clean-period rules"],
] as const;

export default function EconomicAnchors() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2 xl:grid-cols-5">
      {anchors.map(([label, value, note]) => (
        <div key={label} className="bg-black p-6">
          <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">{label}</p>
          <p className="mt-4 text-lg font-medium tracking-tight text-zinc-100">{value}</p>
          <p className="mt-2 text-xs leading-5 text-zinc-600">{note}</p>
        </div>
      ))}
    </div>
  );
}
