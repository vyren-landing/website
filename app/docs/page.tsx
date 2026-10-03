import Link from "next/link";
import { publicPageMetadata } from "@/lib/site-metadata";
import SurfacePage from "@/components/SurfacePage";

export const metadata = publicPageMetadata({
  title: "Documentation",
  description:
    "Public VYREN documentation is a controlled disclosure surface derived from canonical Rev4.6 material.",
  path: "/docs",
});

const groups = [
  {
    title: "Constitutional / normative",
    items: [
      "Rev4.6 canonical architecture",
      "Founder Freedom Architecture",
      "Economic and lifecycle rule surfaces",
    ],
  },
  {
    title: "Implementation / evidence",
    items: [
      "Canonical source identity",
      "Exact-build and test evidence",
      "Production profile and freshness evidence",
    ],
  },
  {
    title: "Public disclosure",
    items: [
      "Protocol overview",
      "Architecture and economics summaries",
      "Lifecycle and project status",
    ],
  },
] as const;

export default function DocsPage() {
  return (
    <SurfacePage
      eyebrow="Documentation"
      title="Disclosure without source substitution."
      description="Public documentation is a controlled projection of canonical material. It can make the system legible without becoming a new canonical specification."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <section key={group.title} className="rounded-2xl border border-zinc-900 p-6">
            <h2 className="text-sm font-medium text-zinc-200">{group.title}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-500">
              {group.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-12 max-w-4xl rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
          Participation preparation
        </p>
        <h2 className="mt-3 text-xl font-medium">
          Locked rules and pending live facts are separated.
        </h2>
        <p className="mt-4 text-sm leading-7 text-zinc-500">
          The pre-Genesis participation guide explains the intended eligibility,
          safeguarded-payment, technical-finality, legal-finality and entitlement
          sequence without presenting an open offer or inventing external facts.
        </p>
        <Link
          href="/docs/participation"
          className="mt-6 inline-block text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
        >
          Read participation preparation guide
        </Link>
      </section>

      <section className="mt-6 max-w-4xl rounded-2xl border border-zinc-900 bg-[#080808] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
          Release discipline
        </p>
        <p className="mt-4 text-sm leading-7 text-zinc-500">
          Internal implementation evidence, private continuity records, live
          provider material and gate-controlled numerical tables are not
          automatically public simply because a public documentation surface
          exists.
        </p>
      </section>
    </SurfacePage>
  );
}
