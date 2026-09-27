"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-900 bg-black/92 backdrop-blur">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close mobile menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="relative z-50 mx-auto flex max-w-[1400px] items-center gap-5 px-5 py-4 md:px-10">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-[0.28em]"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-orange-400">VYREN</span>
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

        <div className="relative ml-auto md:hidden">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="rounded-full border border-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>

          {mobileOpen ? (
            <div
              id="mobile-navigation"
              className="fixed left-4 right-4 top-[76px] z-50 max-h-[calc(100dvh-92px)] overflow-y-auto rounded-2xl border border-zinc-800 bg-black shadow-2xl sm:left-auto sm:w-80"
            >
              <nav aria-label="Mobile navigation" className="p-2">
                <ul className="divide-y divide-zinc-900">
                  {links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        className="block px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-950 hover:text-white"
                        href={href}
                        onClick={() => setMobileOpen(false)}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-950 hover:text-white"
                      href="/genesis"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>Genesis</span>
                      <StateBadge state="PENDING" label="PRE-GENESIS" />
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
