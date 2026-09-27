import { publicPageMetadata } from "@/lib/site-metadata";
import ProtocolMap from "@/components/ProtocolMap";
import SurfacePage from "@/components/SurfacePage";

export const metadata = publicPageMetadata({
  title: "Architecture",
  description: "VYREN architecture separates constitutional rules, economic execution, deployment, evidence, recovery and public disclosure.",
  path: "/architecture",
});

const boundaries = [
  ["Constitutional core", "Defines frozen rule and authority boundaries."],
  ["Economic execution", "Applies locked supply, vesting, settlement and reward semantics."],
  ["Chain / deployment", "Binds code to production addresses, finality and runtime equality."],
  ["Evidence / recovery", "Tracks freshness, replay, monitoring and reconstruction evidence."],
  ["Public disclosure", "Explains the system without inheriting protocol authority."],
] as const;

export default function ArchitecturePage() {
  return (
    <SurfacePage
      eyebrow="Architecture"
      title="Separation is a system property."
      description="VYREN does not collapse narrative, code, deployment and live operation into one claim. Each layer has its own authority boundary and evidence requirement."
    >
      <ProtocolMap />

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 md:grid-cols-2 lg:grid-cols-5">
        {boundaries.map(([title, text]) => (
          <section key={title} className="bg-black p-6">
            <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
            <p className="mt-3 text-xs leading-6 text-zinc-500">{text}</p>
          </section>
        ))}
      </div>

      <section className="mt-14 grid gap-8 rounded-2xl border border-zinc-900 bg-[#080808] p-7 md:grid-cols-2 md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Founder architecture</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">Economic rights without governance authority.</h2>
        </div>
        <p className="text-sm leading-7 text-zinc-500">
          Rev4.6 separates founder economic entitlements from protocol control.
          Founder settlement, reward and delivery rules are modeled as
          deterministic economic surfaces rather than discretionary governance
          permissions. Public presentation should preserve that separation.
        </p>
      </section>
    </SurfacePage>
  );
}
