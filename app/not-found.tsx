import Link from "next/link";
import StateBadge from "@/components/StateBadge";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] px-6 pb-24 pt-36 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-zinc-600">404</p>
          <StateBadge state="INVALID" label="SURFACE NOT FOUND" />
        </div>

        <h1 className="mt-6 text-4xl font-medium tracking-tight md:text-6xl">
          This surface is not part of the current site state.
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-500">
          The route may not exist, may have moved, or may remain outside the
          current public disclosure surface.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-black"
          >
            Return home
          </Link>
          <Link
            href="/status"
            className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300"
          >
            View status
          </Link>
        </div>
      </div>
    </main>
  );
}
