import { publicPageMetadata } from "@/lib/site-metadata";
import EconomicAnchors from "@/components/EconomicAnchors";
import SurfacePage from "@/components/SurfacePage";

export const metadata = publicPageMetadata({
  title: "Economics",
  description: "Locked Rev4.6 economic anchors and separate participant, founder and protocol economic domains.",
  path: "/economics",
});

const flows = [
  { title: "Participant layer", text: "Genesis price, participation bounds, vesting and entitlement rules are predetermined. The current site exposes no transaction path." },
  { title: "Founder layer", text: "Founder economic streams are modeled separately from governance authority and settle through source-preserving rules." },
  { title: "Protocol layer", text: "Reserve, liquidity and operational readiness are evidence-bound and must not be inferred from static token allocation graphics." },
] as const;

export default function EconomicsPage() {
  return (
    <SurfacePage
      eyebrow="Economics"
      title="Locked anchors. Separate economic domains."
      description="The current public surface can disclose core Rev4.6 numerical anchors without presenting Genesis as open or implying live market formation."
    >
      <EconomicAnchors />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {flows.map((flow) => (
          <section key={flow.title} className="rounded-2xl border border-zinc-900 p-6">
            <h2 className="text-sm font-medium text-zinc-200">{flow.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{flow.text}</p>
          </section>
        ))}
      </div>

      <section className="mt-12 max-w-4xl rounded-2xl border border-orange-950/60 bg-orange-950/10 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-orange-400/80">Disclosure boundary</p>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          Full tokenomics and parameter instantiation tables remain
          gate-controlled where required. Publishing a locked numerical anchor
          does not open participation, create a market, establish a balance or
          alter the PRE-GENESIS state.
        </p>
      </section>
    </SurfacePage>
  );
}
