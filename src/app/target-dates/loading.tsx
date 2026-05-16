export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <div className="mb-2 h-3 w-32 animate-pulse rounded bg-muted" />
      <div className="mb-2 h-7 w-64 animate-pulse rounded bg-muted" />
      <div className="mb-8 h-4 w-96 animate-pulse rounded bg-muted" />
      <div className="mb-12 h-36 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
