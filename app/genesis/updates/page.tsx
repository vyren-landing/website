import Link from "next/link";
import GenesisInterestForm from "@/components/GenesisInterestForm";
import SurfacePage from "@/components/SurfacePage";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata({
  title: "Genesis Updates",
  description:
    "Non-binding VYREN Genesis update and participation-readiness registration. Participation remains closed.",
  path: "/genesis/updates",
});

export default function GenesisUpdatesPage() {
  const controllerLabel = process.env.GENESIS_INTEREST_CONTROLLER_LABEL;
  const privacyEmail = process.env.GENESIS_INTEREST_PRIVACY_EMAIL;
  const enabled =
    process.env.GENESIS_INTEREST_OPEN === "true" &&
    Boolean(controllerLabel) &&
    Boolean(privacyEmail);

  return (
    <SurfacePage
      eyebrow="Genesis / Updates"
      title="Follow Genesis progress without creating a participation right."
      description="VYREN is PRE-GENESIS and participation is closed. This surface is designed to retain qualified interest and notify people about project, Genesis-status and participation-readiness updates without pretending that an offer, allocation or transaction path is open."
      state="PENDING"
      stateLabel="NON-BINDING INTEREST"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm leading-7 text-zinc-400">
            Registration here is an expression of interest only. It is not a token reservation,
            allocation, purchase instruction, eligibility decision, queue position, price lock or
            guarantee that Genesis will be available in any jurisdiction.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["What you may receive", "Project progress, Genesis-status and participation-readiness updates."],
              ["What this does not do", "It does not open participation, accept payment or create canonical entitlement."],
              ["Eligibility", "Any future participation remains subject to the actual legal, disclosure and eligibility scope then in force."],
              ["Control", "Consent can be withdrawn through the published privacy contact; collection can be disabled without affecting protocol state."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-zinc-900 bg-[#080808] p-5">
                <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
                <p className="mt-2 text-xs leading-6 text-zinc-500">{detail}</p>
              </div>
            ))}
          </div>

          <GenesisInterestForm
            enabled={enabled}
            controllerLabel={controllerLabel}
            privacyEmail={privacyEmail}
          />
        </div>

        <aside className="rounded-2xl border border-zinc-900 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">State boundary</p>
          <div className="mt-6 space-y-5 text-sm leading-7 text-zinc-500">
            <p><span className="text-zinc-200">Participation:</span> CLOSED.</p>
            <p><span className="text-zinc-200">Payment intake:</span> unavailable.</p>
            <p><span className="text-zinc-200">Allocation:</span> none created by this form.</p>
            <p><span className="text-zinc-200">Priority:</span> none created by this form.</p>
            <p><span className="text-zinc-200">Canonical entitlement:</span> none created by this form.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/docs/participation" className="rounded-full border border-zinc-800 px-4 py-2 text-xs text-zinc-300 hover:border-zinc-600 hover:text-white">
              Participation guide
            </Link>
            <Link href="/status" className="rounded-full border border-zinc-800 px-4 py-2 text-xs text-zinc-300 hover:border-zinc-600 hover:text-white">
              Current status
            </Link>
          </div>
        </aside>
      </div>
    </SurfacePage>
  );
}
