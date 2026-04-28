"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Obligation, ObligationsFilters } from "@/lib/obligation-types";
import { PAGE_SIZE } from "@/lib/obligation-types";
import type { SerializableLookups } from "@/lib/lookup-types";
import { StatsCards } from "./stats-cards";
import { FilterBar } from "./filter-bar";
import { ObligationsTable } from "./obligations-table";
import { ObligationDrawer } from "./obligation-drawer";

type Stats = {
  total: number;
  mandatory: number;
  conditional: number;
  recommended: number;
};

type Props = {
  obligations: Obligation[];
  totalCount: number;
  stats: Stats;
  lookups: SerializableLookups;
  currentFilters: ObligationsFilters;
};

export function ObligationsBrowser({
  obligations,
  totalCount,
  stats,
  lookups,
  currentFilters,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Obligation | null>(null);

  const updateFilters = useCallback(
    (updates: Partial<ObligationsFilters>) => {
      const params = new URLSearchParams();
      const merged: ObligationsFilters = { ...currentFilters, ...updates };

      if (updates.page === undefined) merged.page = 1;

      if (merged.q) params.set("q", merged.q);
      if (merged.source) params.set("source", merged.source);
      if (merged.severity) params.set("severity", merged.severity);
      if (merged.article) params.set("article", merged.article);
      if (merged.addresseeType) params.set("addresseeType", merged.addresseeType);
      if (merged.sortBy) params.set("sortBy", merged.sortBy);
      if (merged.sortDir) params.set("sortDir", merged.sortDir);
      if (merged.page && merged.page > 1)
        params.set("page", String(merged.page));

      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [currentFilters, pathname, router]
  );

  const handleSort = useCallback(
    (field: string, dir: "asc" | "desc") => {
      updateFilters({ sortBy: field, sortDir: dir });
    },
    [updateFilters]
  );

  const currentPage = currentFilters.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3 w-3" />
          Zurück zur Startseite
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">
          Obligation Browser
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          EU AML/CFT Regulatory Framework — AMLR · AMLD6 · ToFR
        </p>
      </div>

      <div className="space-y-6">
        <StatsCards stats={stats} />

        <FilterBar
          filters={currentFilters}
          onFilterChange={updateFilters}
          isPending={isPending}
        />

        <ObligationsTable
          obligations={obligations}
          lookups={lookups}
          filters={currentFilters}
          isPending={isPending}
          onRowClick={setSelected}
          onSort={handleSort}
        />

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Seite {currentPage} von {totalPages} ·{" "}
              <span className="font-medium text-foreground">
                {totalCount.toLocaleString("de-DE")}
              </span>{" "}
              Treffer gesamt
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateFilters({ page: currentPage - 1 })}
                disabled={currentPage <= 1 || isPending}
                className="rounded-md border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Vorherige
              </button>
              <button
                onClick={() => updateFilters({ page: currentPage + 1 })}
                disabled={currentPage >= totalPages || isPending}
                className="rounded-md border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Nächste
              </button>
            </div>
          </div>
        )}
      </div>

      <ObligationDrawer
        obligation={selected}
        lookups={lookups}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
