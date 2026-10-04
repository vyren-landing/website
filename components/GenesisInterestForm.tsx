export default function GenesisInterestForm({
  enabled,
  controllerLabel,
  privacyEmail,
  formAction,
}: {
  enabled: boolean;
  controllerLabel?: string;
  privacyEmail?: string;
  formAction?: string;
}) {
  return (
    <form
      action={enabled ? formAction : undefined}
      method="POST"
      className="mt-8 rounded-2xl border border-zinc-800 bg-[#080808] p-6 md:p-8"
    >
      <div className="grid gap-5">
        <div>
          <label
            htmlFor="genesis-email"
            className="text-sm font-medium text-zinc-200"
          >
            Email for VYREN / Genesis updates
          </label>
          <input
            id="genesis-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={!enabled}
            className="mt-3 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="you@example.com"
          />
        </div>

        <p className="text-xs leading-6 text-zinc-500">
          Before registering, review the{" "}
          <a
            href="/privacy/genesis-updates"
            className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
            target="_blank"
            rel="noreferrer"
          >
            Genesis updates privacy information
          </a>
          . The current controller is{" "}
          <span className="text-zinc-300">
            {controllerLabel ?? "the current VYREN controller"}
          </span>
          . Privacy requests may be sent to{" "}
          <a
            href={`mailto:${privacyEmail ?? "ozgur@vyren.io"}`}
            className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
          >
            {privacyEmail ?? "ozgur@vyren.io"}
          </a>
          .
        </p>

        <label className="flex items-start gap-3 text-xs leading-6 text-zinc-500">
          <input
            type="checkbox"
            required
            disabled={!enabled}
            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-black"
          />
          <span>
            I consent to receiving VYREN project, Genesis-status and
            participation-readiness updates by email. I understand that this is
            optional and non-binding, and that I can withdraw consent at any time.
          </span>
        </label>

        <button
          type="submit"
          disabled={!enabled}
          className="w-fit rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Register non-binding interest
        </button>

        {!enabled ? (
          <p className="text-xs leading-5 text-amber-300/80">
            Update registration is prepared but not open. The Türkiye-local direct
            capture form must be bound before public collection is enabled.
          </p>
        ) : (
          <p className="text-xs leading-5 text-zinc-600">
            On submission, your email is sent directly from your browser to the
            Türkiye-local list processor. It does not pass through the VYREN
            Vercel application endpoint.
          </p>
        )}
      </div>
    </form>
  );
}
