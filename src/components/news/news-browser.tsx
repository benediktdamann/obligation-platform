"use client";

import { useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Loader2, Newspaper } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Regulatory Intelligence
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Daily updates from AMLA, EBA, BaFin, and FATF — curated and linked to your obligations.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or content..."
                defaultValue={currentFilters.q ?? ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    update({ q: (e.target as HTMLInputElement).value || undefined });
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
              />
            </div>
            <select
              value={currentFilters.authority ?? ""}
              onChange={(e) => update({ authority: e.target.value || undefined })}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
            >
              <option value="">All authorities</option>
              <option value="AMLA">AMLA</option>
              <option value="EBA">EBA</option>
              <option value="BAFIN">BaFin</option>
              <option value="FATF">FATF</option>
            </select>
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            <div className="ml-auto text-xs tabular-nums text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-50">{totalCount.toLocaleString("en-US")}</span>{" "}
              {totalCount === 1 ? "item" : "items"}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
              <Newspaper className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">No intelligence items found</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try resetting filters.</p>
            </div>
          ) : (
            items.map((item) => <NewsCard key={item.id} item={item} />)
          )}
        </div>

        {totalCount > 0 && (
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Page{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-50">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-50">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => update({ page: currentPage - 1 })}
                disabled={currentPage <= 1 || isPending}
                className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Previous
              </button>
              <button
                onClick={() => update({ page: currentPage + 1 })}
                disabled={currentPage >= totalPages || isPending}
                className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
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
