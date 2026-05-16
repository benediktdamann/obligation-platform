"use client";

import { useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Search, Loader2 } from "lucide-react";
import type { IntelligenceItem } from "@/lib/news-types";
import { NEWS_PAGE_SIZE } from "@/lib/news-types";
import { NewsCard } from "./news-card";

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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3 w-3" /> Zurück zur Startseite
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight">Regulatory Intelligence</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Updates von AMLA, EBA, BaFin, FATF — täglich aktualisiert.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Titel oder Zusammenfassung durchsuchen..."
            defaultValue={currentFilters.q ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                update({ q: (e.target as HTMLInputElement).value || undefined });
            }}
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <select
          value={currentFilters.authority ?? ""}
          onChange={(e) => update({ authority: e.target.value || undefined })}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">Alle Behörden</option>
          <option value="AMLA">AMLA</option>
          <option value="EBA">EBA</option>
          <option value="BAFIN">BaFin</option>
          <option value="FATF">FATF</option>
        </select>
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed py-20 text-center">
            <p className="text-sm font-medium">Keine Intelligence-Einträge gefunden</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Versuche Filter zurückzusetzen.
            </p>
          </div>
        ) : (
          items.map((item) => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {totalCount > 0 && (
        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Seite {currentPage} von {totalPages} ·{" "}
            <span className="font-medium text-foreground">
              {totalCount.toLocaleString("de-DE")}
            </span>{" "}
            Einträge
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => update({ page: currentPage - 1 })}
              disabled={currentPage <= 1 || isPending}
              className="rounded-md border border-border px-4 py-1.5 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Vorherige
            </button>
            <button
              onClick={() => update({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages || isPending}
              className="rounded-md border border-border px-4 py-1.5 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Nächste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
