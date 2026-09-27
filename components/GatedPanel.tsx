import StateBadge from "@/components/StateBadge";

export default function GatedPanel({
  title,
  description,
  requirements,
}: {
  title: string;
  description: string;
  requirements?: readonly string[];
}) {
  return (
    <section className="max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-medium">{title}</h2>
        <StateBadge state="PENDING" label="LOCKED" />
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-400">{description}</p>

      {requirements?.length ? (
        <ul className="mt-6 space-y-2 border-t border-zinc-900 pt-5 text-xs leading-5 text-zinc-500">
          {requirements.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
