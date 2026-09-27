import type { ReactNode } from "react";
import StateBadge from "@/components/StateBadge";
import type { EvidenceState } from "@/lib/site-state";

export default function SurfacePage({
  eyebrow,
  title,
  description,
  state,
  stateLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  state?: EvidenceState;
  stateLabel?: string;
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen px-6 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-3xl border-b border-zinc-900 pb-12">
          <div className="mb-5 flex items-center gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              {eyebrow}
            </p>
            {state ? <StateBadge state={state} label={stateLabel} /> : null}
          </div>
          <h1 className="text-4xl font-medium tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            {description}
          </p>
        </div>

        {children ? <div className="pt-12">{children}</div> : null}
      </div>
    </main>
  );
}
