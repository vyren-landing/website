const layers = [
  {
    id: "01",
    title: "Constitutional Core",
    text: "Frozen rule boundaries and authority separation.",
  },
  {
    id: "02",
    title: "Economic Engine",
    text: "Deterministic allocation, vesting, settlement and reward rules.",
  },
  {
    id: "03",
    title: "Execution Layer",
    text: "Chain bindings, deployment, finality and transaction paths.",
  },
  {
    id: "04",
    title: "Evidence Layer",
    text: "Freshness, monitoring, replay and verification state.",
  },
  {
    id: "05",
    title: "Public Surface",
    text: "Disclosure and participant interfaces without independent authority.",
  },
] as const;

export default function ProtocolMap() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-zinc-900 bg-[#080808] p-6 md:p-8">
      <div className="protocol-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              System map
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Authority narrows toward the core. Evidence expands outward.
            </p>
          </div>
          <span className="rounded-full border border-orange-900/60 bg-orange-950/20 px-3 py-1 text-[10px] tracking-[0.14em] text-orange-300">
            REV4.6
          </span>
        </div>

        <div className="grid gap-3">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className="group grid gap-3 rounded-2xl border border-zinc-900/90 bg-black/70 p-5 transition hover:border-zinc-700 md:grid-cols-[56px_220px_1fr]"
            >
              <span className="font-mono text-xs text-zinc-700">{layer.id}</span>
              <h3 className={index === 0 ? "text-sm font-medium text-orange-300" : "text-sm font-medium text-zinc-200"}>
                {layer.title}
              </h3>
              <p className="text-sm leading-6 text-zinc-500">{layer.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
