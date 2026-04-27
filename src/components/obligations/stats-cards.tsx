type Stats = {
  total: number;
  mandatory: number;
  conditional: number;
  recommended: number;
};

const CARDS = [
  {
    key: "total" as const,
    label: "Gesamt",
    color: "text-foreground",
    bg: "bg-card",
  },
  {
    key: "mandatory" as const,
    label: "Verpflichtend",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-card",
  },
  {
    key: "conditional" as const,
    label: "Bedingt",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-card",
  },
  {
    key: "recommended" as const,
    label: "Empfohlen",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-card",
  },
];

export function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map(({ key, label, color, bg }) => (
        <div
          key={key}
          className={`rounded-lg border border-border ${bg} px-4 py-3`}
        >
          <p className={`text-2xl font-bold tabular-nums ${color}`}>
            {stats[key].toLocaleString("de-DE")}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
