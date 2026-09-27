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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-900 bg-black/92 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-5 px-5 py-4 md:px-10">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-[0.28em] text-orange-400"
        >
          VYREN
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 flex-1 md:block"
        >
          <ul className="flex items-center gap-5 text-xs text-zinc-400">
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
          className="ml-auto hidden shrink-0 items-center gap-2 md:flex"
        >
          <span className="text-xs text-zinc-400">Genesis</span>
          <StateBadge state="PENDING" label="PRE-GENESIS" />
        </Link>

        <details className="group relative ml-auto md:hidden">
          <summary className="list-none cursor-pointer rounded-full border border-zinc-800 px-3 py-2 text-xs text-zinc-300 marker:hidden">
            Menu
          </summary>

          <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
            <nav aria-label="Mobile navigation" className="p-2">
              <ul className="divide-y divide-zinc-900">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      className="block px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-950 hover:text-white"
                      href={href}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-950 hover:text-white"
                    href="/genesis"
                  >
                    <span>Genesis</span>
                    <StateBadge state="PENDING" label="PRE-GENESIS" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
