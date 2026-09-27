import SurfacePage from "@/components/SurfacePage";

const layers = [
  "Constitutional / rule layer",
  "Economic execution layer",
  "Deployment and chain-binding layer",
  "Evidence and freshness layer",
  "Recovery and continuity layer",
  "Public disclosure layer",
] as const;

export default function ArchitecturePage() {
  return (
    <SurfacePage
      eyebrow="Architecture"
      title="Separate layers. Explicit boundaries."
      description="The public site describes the architecture, but it does not replace the canonical specification or implementation source."
    >
      <ol className="grid gap-4 md:grid-cols-2">
        {layers.map((layer, index) => (
          <li key={layer} className="rounded-2xl border border-zinc-900 p-6">
            <p className="text-xs text-zinc-600">0{index + 1}</p>
            <p className="mt-3 text-sm text-zinc-200">{layer}</p>
          </li>
        ))}
      </ol>
    </SurfacePage>
  );
}
