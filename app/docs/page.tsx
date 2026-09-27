import SurfacePage from "@/components/SurfacePage";

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
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Release discipline</p>
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
