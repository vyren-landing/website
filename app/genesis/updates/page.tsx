import Link from "next/link";
import SurfacePage from "@/components/SurfacePage";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata({
  title: "Genesis Updates",
  description:
    "Follow VYREN project and Genesis-status updates through the public channels. Participation remains closed.",
  path: "/genesis/updates",
});

export default function GenesisUpdatesPage() {
  return (
    <SurfacePage
      eyebrow="Genesis / Updates"
      title="Follow VYREN through the public channels."
      description="VYREN is PRE-GENESIS and participation is closed. Public progress, Genesis-status and participation-readiness updates are currently distributed through the website and official social channels without an email-list signup."
      state="PENDING"
      stateLabel="PUBLIC UPDATES"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm leading-7 text-zinc-400">
            Following VYREN or visiting this page does not create a token reservation,
            allocation, purchase instruction, eligibility decision, queue position,
            price lock or guarantee that Genesis will be available in any jurisdiction.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Website", "Canonical project, lifecycle, evidence and current-state information."],
              ["X", "Discovery, conversation and concise project / use-case updates."],
              ["LinkedIn", "Founder, build-progress and professional updates."],
              ["Medium", "Long-form explanations, context and deeper project material."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-zinc-900 bg-[#080808] p-5">
                <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
                <p className="mt-2 text-xs leading-6 text-zinc-500">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://x.com/vyrenio"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
            >
              Follow on X
            </a>
            <a
              href="https://www.linkedin.com/company/vyrenlabs"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              Follow on LinkedIn
            </a>
            <a
              href="https://medium.com/@vyren"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              Read on Medium
            </a>
          </div>
        </div>

        <aside className="rounded-2xl border border-zinc-900 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">State boundary</p>
          <div className="mt-6 space-y-5 text-sm leading-7 text-zinc-500">
            <p><span className="text-zinc-200">Participation:</span> CLOSED.</p>
            <p><span className="text-zinc-200">Payment intake:</span> unavailable.</p>
            <p><span className="text-zinc-200">Email signup:</span> not in use.</p>
            <p><span className="text-zinc-200">Allocation:</span> none created by following a channel.</p>
            <p><span className="text-zinc-200">Canonical entitlement:</span> none created by following a channel.</p>
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
