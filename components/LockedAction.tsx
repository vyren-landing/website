export default function LockedAction({
  title,
  reason,
}: {
  title: string;
  reason: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-[#080808] p-6">
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-medium text-zinc-600"
      >
        {title}
      </button>
      <p className="mt-3 text-xs leading-5 text-zinc-600">{reason}</p>
    </div>
  );
}
