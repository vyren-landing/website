import Link from "next/link";
import StateBadge from "@/components/StateBadge";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-16">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.24em] text-orange-400">
              VYREN
            </span>
            <StateBadge state="PENDING" label="PRE-GENESIS" />
          </div>
          <p className="text-sm leading-6 text-zinc-500">
            Public information is separated from protocol authority. Website
            state does not create deployment, participation, settlement, or
            activation authority.
          </p>
          <p className="mt-4 max-w-xl text-xs leading-5 text-zinc-600">
            Informational architecture material only. Nothing on this website is
            an offer, solicitation, investment recommendation, legal opinion or
            guarantee of price, liquidity, listing, regulatory outcome, security,
            uptime or return.
          </p>
          <p className="mt-5 text-xs text-zinc-500">
            Public updates have resumed as Vyren enters its next phase.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs text-zinc-500">
          <Link className="hover:text-white" href="/ecosystem">Ecosystem</Link>
          <Link className="hover:text-white" href="/docs">Documentation</Link>
          <Link className="hover:text-white" href="/status">Status</Link>
          <Link className="hover:text-white" href="/genesis">Genesis</Link>
          <Link className="hover:text-white" href="/verification">Verification</Link>
          <a className="hover:text-white" href="https://x.com/vyrenio" target="_blank" rel="noreferrer">X</a>
          <a className="hover:text-white" href="https://www.linkedin.com/company/vyrenlabs" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="hover:text-white" href="https://medium.com/@vyren" target="_blank" rel="noreferrer">Medium</a>
        </div>
      </div>
    </footer>
  );
}
