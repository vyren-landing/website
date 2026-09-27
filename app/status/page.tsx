import SurfacePage from "@/components/SurfacePage";
import StateBadge from "@/components/StateBadge";
import { PROTOCOL_STATE, protocolStateSummary } from "@/lib/site-state";

export default function StatusPage() {
  return (
    <SurfacePage
      eyebrow="Status"
      title="PRE-GENESIS"
      description="This page reports the website's public representation of the current protocol state. It does not independently assert deployment, activation, or financial readiness."
      state="PENDING"
      stateLabel="PRE-GENESIS"
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2">
        {protocolStateSummary.map((item) => (
          <section key={item.label} className="bg-black p-6">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium">{item.label}</h2>
              <StateBadge state={item.state} />
            </div>
            <p className="mt-4 text-sm text-zinc-500">{item.value}</p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-900 p-6 text-sm leading-7 text-zinc-500">
        R2: {PROTOCOL_STATE.r2} · Gate G: {PROTOCOL_STATE.gateG} · Activation: {PROTOCOL_STATE.activation}
      </div>
    </SurfacePage>
  );
}
