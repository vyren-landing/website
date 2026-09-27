import { publicPageMetadata } from "@/lib/site-metadata";
import ProtocolMap from "@/components/ProtocolMap";
import SurfacePage from "@/components/SurfacePage";

export const metadata = publicPageMetadata({
  title: "Protocol",
  description: "Rule boundaries, bounded authority, deterministic execution and public disclosure boundaries.",
  path: "/protocol",
});

const principles = [
  ["Deterministic execution", "Critical behavior is specified before demand or market pressure appears."],
  ["Bounded authority", "Operational actors may perform named roles without inheriting undefined protocol control."],
  ["State separation", "Architecture, implementation, deployment, live evidence, Genesis and activation are represented independently."],
  ["Recovery as reconstruction", "Recovery is designed to reconstruct canonical state rather than create a discretionary reset path."],
] as const;

export default function ProtocolPage() {
  return (
    <SurfacePage
      eyebrow="Protocol"
      title="Rules first. Authority bounded."
      description="Vyren is organized around deterministic rules, explicit state transitions and evidence-bound operation. The public website describes that model without becoming an execution authority."
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          {principles.map(([title, text]) => (
            <section key={title} className="rounded-2xl border border-zinc-900 p-6">
              <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
            </section>
          ))}
        </div>
        <ProtocolMap />
      </div>

      <section className="mt-14 max-w-4xl border-t border-zinc-900 pt-10">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Public boundary</p>
        <p className="mt-4 text-sm leading-7 text-zinc-500">
          The website is a disclosure and interface surface. It does not
          supersede canonical documentation, canonical implementation source,
          deployment evidence, legal eligibility, settlement evidence or live
          monitoring state.
        </p>
      </section>
    </SurfacePage>
  );
}
