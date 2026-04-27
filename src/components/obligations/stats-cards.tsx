type Stats = {
  total: number;
  mandatory: number;
  conditional: number;
  recommended: number;
};

const CARDS = [
  {
    key: "total" as const,
    label: "Anforderungen gesamt",
    accent: "bg-slate-400 dark:bg-slate-500",
  },
  {
    key: "mandatory" as const,
    label: "Verpflichtend",
    accent: "bg-red-400",
  },
  {
    key: "conditional" as const,
    label: "Bedingt",
    accent: "bg-yellow-400",
  },
  {
    key: "recommended" as const,
    label: "Empfohlen",
    accent: "bg-blue-400",
  },
];

export function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {CARDS.map(({ key, label, accent }) => (
        <div
          key={key}
          className="rounded-xl border bg-card px-5 py-5 transition-shadow duration-200 hover:shadow-md"
        >
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {stats[key].toLocaleString("de-DE")}
          </p>
          <div className={`mt-4 h-0.5 w-8 rounded-full ${accent}`} />
        </div>
      ))}
    </div>
  );
}
