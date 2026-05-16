"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Loader2, Newspaper, Zap, Calendar, Building2 } from "lucide-react";
import type { IntelligenceItem } from "@/lib/news-types";
import { NEWS_PAGE_SIZE } from "@/lib/news-types";
import { NewsCard } from "./news-card";
import { SiteNav } from "@/components/site-nav";

type Filters = { q?: string; authority?: string; page?: number };

type Props = {
  items: IntelligenceItem[];
  totalCount: number;
  currentFilters: Filters;
};

export function NewsBrowser({ items, totalCount, currentFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (updates: Partial<Filters>) => {
      const params = new URLSearchParams();
      const merged = { ...currentFilters, ...updates };
      if (updates.page === undefined) merged.page = 1;
      if (merged.q) params.set("q", merged.q);
      if (merged.authority) params.set("authority", merged.authority);
      if (merged.page && merged.page > 1) params.set("page", String(merged.page));
      const qs = params.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    },
    [currentFilters, pathname, router]
  );

  const currentPage = currentFilters.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / NEWS_PAGE_SIZE));

  // Page-level stats
  const pageStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = items.filter(i => i.published_date && new Date(i.published_date) >= weekAgo).length;
    const highUrgency = items.filter(i => ["high", "High"].includes(i.urgency)).length;
    const authorities = new Set(items.map(i => i.source_authority).filter(Boolean));
    return { thisWeek, highUrgency, authorityCount: authorities.size };
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">News & Intelligence</h1>
          <p className="mt-1 text-sm text-slate-400">
            Daily updates from AMLA, EBA, BaFin, FATF
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPICard icon={Newspaper} label="Total items" value={totalCount.toLocaleString("en-US")} accent="text-indigo-400" />
          <KPICard icon={Calendar} label="On this page" value={`${items.length}`} sub={`of ${totalCount}`} accent="text-slate-200" />
          <KPICard icon={Zap} label="High urgency" value={`${pageStats.highUrgency}`} sub="on this page" accent="text-rose-400" />
          <KPICard icon={Building2} label="Authorities" value={`${pageStats.authorityCount}`} sub="on this page" accent="text-violet-400" />
        </div>

        {/* Filter bar */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search title or content..."
                defaultValue={currentFilters.q ?? ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") update({ q: (e.target as HTMLInputElement).value || undefined });
                }}
                className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
            <select
              value={currentFilters.authority ?? ""}
              onChange={(e) => update({ authority: e.target.value || undefined })}
              className="h-9 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="">All authorities</option>
              <option value="AMLA">AMLA</option>
              <option value="EBA">EBA</option>
              <option value="BAFIN">BaFin</option>
              <option value="FATF">FATF</option>
            </select>
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
          </div>
        </div>

        {/* Feed */}
        <div className="mt-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 py-16 text-center">
              <Newspaper className="mx-auto mb-3 h-8 w-8 text-slate-700" />
              <p className="text-sm font-medium text-slate-300">No intelligence items found</p>
              <p className="mt-1 text-xs text-slate-500">Try resetting filters.</p>
            </div>
          ) : (
            items.map((item) => <NewsCard key={item.id} item={item} />)
          )}
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-200">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-200">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => update({ page: currentPage - 1 })}
                disabled={currentPage <= 1 || isPending}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => update({ page: currentPage + 1 })}
                disabled={currentPage >= totalPages || isPending}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function KPICard({
  icon: Icon, label, value, sub, accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className={`mt-3 text-4xl font-bold tabular-nums ${accent ?? "text-slate-50"}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}
