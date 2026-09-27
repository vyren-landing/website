import SurfacePage from "@/components/SurfacePage";

export default function DocsPage() {
  return (
    <SurfacePage
      eyebrow="Documentation"
      title="Public disclosure, not canonical substitution."
      description="Public documents are selected and compressed from the canonical Rev4.6 body under disclosure controls. Internal evidence, private implementation material, and gated production data remain separate."
    >
      <div className="max-w-3xl rounded-2xl border border-zinc-900 p-6 text-sm leading-7 text-zinc-500">
        Public document indexing and release controls will be attached here in a
        later site phase. No document listed here will silently supersede its
        canonical source.
      </div>
    </SurfacePage>
  );
}
