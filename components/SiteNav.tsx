import Link from "next/link";
import StateBadge from "@/components/StateBadge";

const links = [
  ["Protocol", "/protocol"],
  ["Architecture", "/architecture"],
  ["Economics", "/economics"],
  ["Lifecycle", "/lifecycle"],
  ["Evidence", "/evidence"],
  ["Docs", "/docs"],
  ["Status", "/status"],
] as const;

export default function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-900 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-4 md:px-10">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-[0.28em] text-orange-400"
        >
          VYREN
        </Link>

        <nav
          aria-label="Primary navigation"
          className="min-w-0 flex-1 overflow-x-auto"
        >
          <ul className="flex min-w-max items-center gap-5 text-xs text-zinc-400">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link className="transition hover:text-white" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/genesis"
          className="hidden shrink-0 items-center gap-2 md:flex"
        >
          <span className="text-xs text-zinc-400">Genesis</span>
          <StateBadge state="PENDING" label="PRE-GENESIS" />
        </Link>
      </div>
    </header>
  );
}
