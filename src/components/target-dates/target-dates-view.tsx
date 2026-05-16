import { Calendar, ExternalLink, AlertCircle, Clock, Target, CheckCircle2, TrendingUp } from "lucide-react";
import type { TargetDate } from "@/lib/target-date-types";
import { bucketFor, daysUntil, CATEGORY_LABELS } from "@/lib/target-date-types";
import { SiteNav } from "@/components/site-nav";

const BUCKET_CONFIG = [
  { key: "imminent" as const, title: "Imminent", subtitle: "Within 30 days", color: "text-rose-400", dotColor: "bg-rose-500" },
  { key: "upcoming" as const, title: "Upcoming", subtitle: "Next 6 months", color: "text-amber-400", dotColor: "bg-amber-500" },
  { key: "strategic" as const, title: "Strategic", subtitle: "Beyond 6 months", color: "text-blue-400", dotColor: "bg-blue-500" },
  { key: "completed" as const, title: "In Force", subtitle: "Already effective", color: "text-emerald-400", dotColor: "bg-emerald-500" },
];

const CATEGORY_DOT: Record<string, string> = {
  regulation_apply: "bg-rose-500",
  supervision_start: "bg-violet-500",
  consultation_close: "bg-amber-500",
  deadline: "bg-orange-500",
  review_milestone: "bg-blue-500",
};

type Props = { dates: TargetDate[]; nextMilestone: TargetDate | null };

export function TargetDatesView({ dates, nextMilestone }: Props) {
  const now = new Date();
  const grouped: Record<string, TargetDate[]> = {
    imminent: [], upcoming: [], strategic: [], completed: [],
  };
  for (const d of dates) grouped[bucketFor(d, now)].push(d);

  const nextDays = nextMilestone ? daysUntil(nextMilestone.target_date) : null;

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Target Dates</h1>
          <p className="mt-1 text-sm text-slate-400">
            Regulatory milestones — AMLR, AMLD6, AMLA, RTS consultations
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Next milestone — large countdown */}
          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <Calendar className="h-3 w-3" />
              Next milestone
            </div>
            {nextMilestone ? (
              <>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-5xl font-bold tabular-nums text-slate-50">{nextDays}</span>
                  <span className="text-sm text-slate-400">days</span>
                </div>
                <div className="mt-2 line-clamp-2 text-xs text-slate-400">{nextMilestone.title}</div>
              </>
            ) : (
              <div className="mt-3 text-2xl font-bold text-slate-500">—</div>
            )}
          </div>

          {/* Bucket counts */}
          {BUCKET_CONFIG.filter(b => b.key !== "completed").map(({ key, title, subtitle, color }) => (
            <div key={key} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{title}</div>
                <div className={`h-1.5 w-1.5 rounded-full ${BUCKET_CONFIG.find(b => b.key === key)?.dotColor}`} />
              </div>
              <div className={`mt-3 text-5xl font-bold tabular-nums ${color}`}>
                {grouped[key].length}
              </div>
              <div className="mt-2 text-xs text-slate-500">{subtitle}</div>
            </div>
          ))}
        </div>

        {/* Detail hero for next milestone */}
        {nextMilestone && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-6">
            <div className="flex items-center gap-1.5 mb-3 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              <TrendingUp className="h-3 w-3" />
              Upcoming critical milestone
            </div>
            <h2 className="text-xl font-bold text-slate-50 mb-1.5">{nextMilestone.title}</h2>
            {nextMilestone.description && (
              <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-400">{nextMilestone.description}</p>
            )}
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <div className="text-6xl font-bold tabular-nums text-slate-50">{nextDays}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">days remaining</div>
              </div>
              <div className="pb-2">
                <div className="text-sm font-semibold text-slate-300">
                  {new Date(nextMilestone.target_date).toLocaleDateString("en-US", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{CATEGORY_LABELS[nextMilestone.category] ?? nextMilestone.category}</div>
              </div>
            </div>
          </div>
        )}

        {/* Bucket grids */}
        <div className="mt-8 space-y-8">
          {BUCKET_CONFIG.map(({ key, title, subtitle, color, dotColor }) => {
            const items = grouped[key];
            if (items.length === 0) return null;
            return (
              <section key={key}>
                <div className="mb-3 flex items-baseline gap-2.5 border-b border-slate-800 pb-2.5">
                  <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                  <h2 className={`text-sm font-semibold ${color}`}>{title}</h2>
                  <span className="text-xs text-slate-500">{subtitle}</span>
                  <span className="ml-auto text-xs tabular-nums text-slate-500">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
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

function TargetDateCard({ date }: { date: TargetDate }) {
  const days = daysUntil(date.target_date);
  const formatted = new Date(date.target_date).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
  const isPast = days < 0;
  const categoryDot = CATEGORY_DOT[date.category] ?? "bg-slate-500";

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${categoryDot}`} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {CATEGORY_LABELS[date.category] ?? date.category}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500">{formatted}</div>
          <div className="text-xs font-semibold tabular-nums text-slate-300">
            {isPast ? `${Math.abs(days)}d ago` : `in ${days}d`}
          </div>
        </div>
      </div>
      <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-50">{date.title}</h3>
      {date.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{date.description}</p>
      )}
      {date.affected_entities && date.affected_entities.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {date.affected_entities.slice(0, 3).map((e) => (
            <span key={e} className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400">{e}</span>
          ))}
          {date.affected_entities.length > 3 && (
            <span className="text-[10px] text-slate-500">+{date.affected_entities.length - 3}</span>
          )}
        </div>
      )}
      {date.external_url && (
        <a href={date.external_url} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-medium text-indigo-400 hover:text-indigo-300">
          Source <ExternalLink className="h-2.5 w-2.5" />
        </a>
      )}
    </div>
  );
}
