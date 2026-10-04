import Link from "next/link";
import SurfacePage from "@/components/SurfacePage";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata({
  title: "Genesis Updates Privacy Information",
  description:
    "Privacy information for the non-binding VYREN Genesis updates and participation-readiness registration.",
  path: "/privacy/genesis-updates",
});

export default function GenesisUpdatesPrivacyPage() {
  const controllerLabel =
    process.env.GENESIS_INTEREST_CONTROLLER_LABEL ?? "Özgür Dinç";
  const privacyEmail =
    process.env.GENESIS_INTEREST_PRIVACY_EMAIL ?? "ozgur@vyren.io";

  return (
    <SurfacePage
      eyebrow="Privacy / Genesis Updates"
      title="Privacy information for the Genesis updates list."
      description="This notice is limited to the non-binding VYREN project, Genesis-status and participation-readiness update registration. It does not create participation, allocation, priority, price rights or canonical entitlement."
      state="PENDING"
      stateLabel="COLLECTION CONTROLLED"
    >
      <div className="max-w-4xl space-y-10 text-sm leading-7 text-zinc-500">
        <section className="rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
          <h2 className="text-lg font-medium text-zinc-200">Controller and contact</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-[180px_1fr]">
            <span className="text-zinc-600">Controller</span>
            <span className="text-zinc-300">{controllerLabel}</span>
            <span className="text-zinc-600">Project</span>
            <span className="text-zinc-300">VYREN</span>
            <span className="text-zinc-600">Privacy contact</span>
            <a
              className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
              href={`mailto:${privacyEmail}`}
            >
              {privacyEmail}
            </a>
          </div>
          <p className="mt-5 text-xs leading-6 text-zinc-600">
            If a future VYREN legal entity becomes the controller, affected users
            will be informed as required before or when that controller transition
            takes effect. A controller transition does not silently expand the
            processing purpose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200">Data and purpose</h2>
          <p className="mt-3">
            When registration is enabled, the update list is designed to process
            the email address you submit together with a consent record, consent
            version and timestamp, and a limited source/campaign identifier. The
            purpose is to send VYREN project progress, Genesis-status and
            participation-readiness updates and to maintain evidence of the
            consent associated with that registration.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200">Legal basis</h2>
          <p className="mt-3">
            The intended processing basis for update-list registration is your
            consent / explicit consent where applicable. Consent is optional.
            Refusing or withdrawing it does not affect access to the public VYREN
            website and does not affect any protocol state.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200">Recipients and infrastructure</h2>
          <p className="mt-3">
            The public website may use separate hosting and analytics infrastructure,
            but the Genesis update email list is not collected through the Vercel
            application endpoint. When registration is enabled, the form will submit
            directly from the visitor's browser to the selected Türkiye-local data
            processor under a dedicated processing arrangement.
          </p>
          <p className="mt-3">
            Automated collection remains disabled until that Türkiye-local processor,
            the exact form/consent record, retention controls and replacement/export
            path are bound. If the processor is replaced, the processing purpose
            remains the same and this notice will be updated where required.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200">Retention</h2>
          <p className="mt-3">
            An active contact record is intended to be kept until you withdraw
            consent, the update list is closed, or the record is no longer needed
            for the stated purpose. After withdrawal, the address is removed from
            active update use. A minimal record of consent or withdrawal may be
            retained only where reasonably required to demonstrate compliance or
            meet a legal obligation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-200">Your choices and rights</h2>
          <p className="mt-3">
            You may withdraw consent at any time by contacting{" "}
            <a
              className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
              href={`mailto:${privacyEmail}`}
            >
              {privacyEmail}
            </a>
            . Depending on the law applicable to you, you may also have rights
            to request access, correction, deletion, restriction, objection,
            information about processing or transfers, and to make a complaint
            to the competent data-protection authority. Withdrawal does not
            affect the lawfulness of processing carried out before withdrawal.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-900 p-6">
          <h2 className="text-lg font-medium text-zinc-200">Current state</h2>
          <p className="mt-3">
            VYREN remains PRE-GENESIS. Participation and payment intake are
            closed. Registration for project / Genesis updates is separate from
            participation. Automated collection remains closed until a Türkiye-local
            direct-capture processor is bound; no email address is accepted by the
            current Vercel application endpoint.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/genesis/updates"
            className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
          >
            Genesis updates
          </Link>
          <Link
            href="/status"
            className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
          >
            Current status
          </Link>
        </div>
      </div>
    </SurfacePage>
  );
}
