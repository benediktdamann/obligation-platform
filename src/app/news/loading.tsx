export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <div className="mb-2 h-3 w-32 animate-pulse rounded bg-muted" />
      <div className="mb-2 h-7 w-64 animate-pulse rounded bg-muted" />
      <div className="mb-8 h-4 w-80 animate-pulse rounded bg-muted" />
      <div className="mb-6 flex gap-2">
        <div className="h-9 flex-1 animate-pulse rounded bg-muted" />
        <div className="h-9 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
