import Link from "next/link";
import SurfacePage from "@/components/SurfacePage";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata({
  title: "Privacy — Genesis Updates",
  description:
    "Privacy information for VYREN Genesis-status and participation-readiness update registration.",
  path: "/privacy/genesis-updates",
});

export default function GenesisUpdatesPrivacyPage() {
  const controller =
    process.env.GENESIS_INTEREST_CONTROLLER_LABEL ?? "VYREN Project";
  const privacyEmail =
    process.env.GENESIS_INTEREST_PRIVACY_EMAIL ?? "contact@vyren.io";

  return (
    <SurfacePage
      eyebrow="Privacy / Genesis Updates"
      title="Privacy information for the non-binding update list."
      description="This notice applies only to the VYREN project / Genesis-status and participation-readiness update registration. It does not create participation, allocation, priority, price rights or canonical entitlement."
      state="PENDING"
      stateLabel="PRE-GENESIS"
    >
      <div className="max-w-3xl space-y-10 text-sm leading-7 text-zinc-500">
        <section>
          <h2 className="text-base font-medium text-zinc-200">Controller and contact</h2>
          <p className="mt-3">
            Current controller: <span className="text-zinc-300">{controller}</span>.
            Privacy and consent requests:{" "}
            <a className="text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300" href={`mailto:${privacyEmail}`}>
              {privacyEmail}
            </a>.
          </p>
          <p className="mt-3">
            The planned Estonian OÜ is not presented here as the current controller before it
            actually exists and assumes that role. If the controller changes, this notice and
            the public registration surface must be updated before relying on the new identity.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-zinc-200">Data and purpose</h2>
          <p className="mt-3">
            The registration stores the email address you submit, consent status, consent
            version and timestamp, and a limited source tag used to understand which VYREN
            surface led to the registration. The purpose is to send VYREN project,
            Genesis-status and participation-readiness updates.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-zinc-200">Legal basis</h2>
          <p className="mt-3">
            The update list relies on your consent. Registration is optional. Withdrawing
            consent does not affect the lawfulness of processing that occurred before
            withdrawal.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-zinc-200">Storage and recipients</h2>
          <p className="mt-3">
            Registration records are stored in private infrastructure used by VYREN. The
            current capture layer uses Vercel-hosted infrastructure and a private Vercel Blob
            store. Service providers may process data only as needed to provide the relevant
            hosting, storage or delivery service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-zinc-200">Retention</h2>
          <p className="mt-3">
            The registration is kept while the update purpose remains active or until consent
            is withdrawn, subject to limited retention of consent evidence where reasonably
            required to demonstrate compliance. Data that is no longer needed for the stated
            purpose should be deleted or de-identified.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-zinc-200">Your choices and rights</h2>
          <p className="mt-3">
            You may withdraw consent and may request access, correction, deletion, restriction
            or portability where applicable. You may also raise a concern with the competent
            data-protection supervisory authority applicable to your situation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-zinc-200">No participation effect</h2>
          <p className="mt-3">
            Submitting an email does not reserve VYREN, create a queue position, fix a price,
            guarantee eligibility, accept payment, open Genesis or create any protocol-side or
            canonical entitlement.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/genesis/updates" className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black hover:bg-white">
            Back to Genesis updates
          </Link>
          <Link href="/status" className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white">
            Current status
          </Link>
        </div>
      </div>
    </SurfacePage>
  );
}
