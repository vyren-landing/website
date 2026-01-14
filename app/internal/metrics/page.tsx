import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vyren — Internal Metrics",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InternalMetrics() {
  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-32">
      <section className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-medium">
          Internal Metrics
        </h1>

        <p className="text-gray-400 text-sm">
          This page is reserved for internal visibility and system observation.
          It is not part of the public protocol surface.
        </p>

        <div className="border border-gray-800 p-6 space-y-4 text-sm">
          <p><strong>Status</strong></p>
          <p>Visibility: Internal only</p>
          <p>Indexing: Disabled</p>
          <p>Public access: Not referenced</p>
          <p>Data sources: Not yet connected</p>
        </div>

        <p className="text-xs text-gray-500">
          Metrics and observational tooling will be attached incrementally.
          No user-facing signals originate from this surface.
        </p>
      </section>
    </main>
  );
}
