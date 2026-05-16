import { Calendar, ExternalLink, AlertCircle, Clock, Target, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TargetDate } from "@/lib/target-date-types";
import { bucketFor, daysUntil, CATEGORY_LABELS } from "@/lib/target-date-types";
import { SiteNav } from "@/components/site-nav";

const BUCKET_CONFIG = [
  { key: "imminent" as const, title: "Imminent", subtitle: "Within 30 days", icon: AlertCircle, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
  { key: "upcoming" as const, title: "Upcoming", subtitle: "Next 6 months", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { key: "strategic" as const, title: "Strategic horizon", subtitle: "Beyond 6 months", icon: Target, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { key: "completed" as const, title: "In force", subtitle: "Already effective", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
];

const CATEGORY_ACCENT: Record<string, string> = {
  regulation_apply: "border-l-rose-500",
  supervision_start: "border-l-violet-500",
  consultation_close: "border-l-amber-500",
  deadline: "border-l-orange-500",
  review_milestone: "border-l-blue-500",
};

const CATEGORY_BADGE: Record<string, string> = {
  regulation_apply: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  supervision_start: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/50",
  consultation_close: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  deadline: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50",
  review_milestone: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
};

type Props = { dates: TargetDate[]; nextMilestone: TargetDate | null };

export function TargetDatesView({ dates, nextMilestone }: Props) {
  const now = new Date();
  const grouped: Record<string, TargetDate[]> = {
    imminent: [], upcoming: [], strategic: [], completed: [],
  };
  for (const d of dates) grouped[bucketFor(d, now)].push(d);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Target Dates
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Every regulatory milestone affecting AML/CFT compliance — AMLR, AMLD6, AMLA, RTS consultations.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BUCKET_CONFIG.map(({ key, title, icon: Icon, color, bg }) => (
            <div
              key={key}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {title}
                </span>
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
                {grouped[key].length}
              </div>
            </div>
          ))}
        </div>

        {nextMilestone && <CountdownHero milestone={nextMilestone} />}

        <div className="mt-10 space-y-10">
          {BUCKET_CONFIG.map(({ key, title, subtitle, icon: Icon, color }) => {
            const items = grouped[key];
            if (items.length === 0) return null;
            return (
              <section key={key}>
                <div className="mb-4 flex items-baseline gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
                  <span className="ml-auto text-sm tabular-nums text-slate-500 dark:text-slate-400">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((d) => <TargetDateCard key={d.id} date={d} />)}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function CountdownHero({ milestone }: { milestone: TargetDate }) {
  const days = daysUntil(milestone.target_date);
  const date = new Date(milestone.target_date).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-white p-6 shadow-sm dark:border-slate-800 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-950/50">
          <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
          Next milestone
        </span>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{milestone.title}</h2>
      {milestone.description && (
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {milestone.description}
        </p>
      )}
      <div className="flex items-end gap-4">
        <div>
          <div className="text-6xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
            {days}
          </div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {days === 1 ? "day" : "days"} remaining
          </div>
        </div>
        <div className="pb-2">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{date}</div>
          <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {CATEGORY_LABELS[milestone.category] ?? milestone.category}
          </div>
        </div>
      </div>
    </div>
  );
}

function TargetDateCard({ date }: { date: TargetDate }) {
  const days = daysUntil(date.target_date);
  const formatted = new Date(date.target_date).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
  const isPast = days < 0;
  const accentBorder = CATEGORY_ACCENT[date.category] ?? "border-l-slate-400";
  const categoryBadgeClass = CATEGORY_BADGE[date.category] ?? "";

  return (
    <Card className={`group overflow-hidden border-l-2 ${accentBorder} bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={`border text-[10px] font-semibold uppercase tracking-wider ${categoryBadgeClass}`}
          >
            {CATEGORY_LABELS[date.category] ?? date.category}
          </Badge>
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">{formatted}</div>
            <div className="text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {isPast ? `${Math.abs(days)}d ago` : `in ${days}d`}
            </div>
          </div>
        </div>
        <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {date.title}
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        {date.description && (
          <p className="line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {date.description}
          </p>
        )}
        {date.affected_entities && date.affected_entities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {date.affected_entities.slice(0, 3).map((e) => (
              <Badge
                key={e}
                variant="outline"
                className="border-slate-200 text-[10px] font-normal text-slate-600 dark:border-slate-700 dark:text-slate-400"
              >
                {e}
              </Badge>
            ))}
            {date.affected_entities.length > 3 && (
              <span className="text-[10px] text-slate-400">+{date.affected_entities.length - 3}</span>
            )}
          </div>
        )}
        {date.external_url && (
          <a
            href={date.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Source <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
