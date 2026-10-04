"use client";

import { FormEvent, useState } from "react";

export default function GenesisInterestForm({
  enabled,
  controllerLabel,
  privacyEmail,
}: {
  enabled: boolean;
  controllerLabel?: string;
  privacyEmail?: string;
}) {
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || state === "saving") return;

    const form = new FormData(event.currentTarget);
    setState("saving");
    setMessage("");

    const response = await fetch("/api/genesis-interest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        consent: form.get("consent") === "on",
        website: form.get("website"),
        source: new URLSearchParams(window.location.search).get("source") ?? "c0-site-02",
      }),
    });

    if (response.ok) {
      event.currentTarget.reset();
      setState("done");
      setMessage("Interest recorded. This is non-binding and does not create an allocation, entitlement, priority or participation guarantee.");
      return;
    }

    setState("error");
    setMessage("The update list is not available right now. No participation action has been created.");
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border border-zinc-800 bg-[#080808] p-6 md:p-8">
      <div className="grid gap-5">
        <div>
          <label htmlFor="genesis-email" className="text-sm font-medium text-zinc-200">
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

        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex items-start gap-3 text-xs leading-6 text-zinc-500">
          <input
            name="consent"
            type="checkbox"
            required
            disabled={!enabled}
            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-black"
          />
          <span>
            I agree that {controllerLabel ?? "the current VYREN controller"} may use my email
            to send VYREN project, Genesis-status and participation-readiness updates. This
            registration is non-binding and does not reserve tokens, guarantee eligibility,
            create priority, fix a price or create any entitlement. I can withdraw this
            consent by contacting {privacyEmail ?? "the published privacy contact"}.
          </span>
        </label>

        <button
          type="submit"
          disabled={!enabled || state === "saving"}
          className="w-fit rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state === "saving" ? "Recording…" : "Register non-binding interest"}
        </button>

        {!enabled ? (
          <p className="text-xs leading-5 text-amber-300/80">
            Update registration is prepared but not open. Current controller/contact details
            must be bound before public collection is enabled.
          </p>
        ) : null}

        {message ? (
          <p
            role="status"
            className={`text-xs leading-6 ${state === "done" ? "text-emerald-300" : "text-red-300"}`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
