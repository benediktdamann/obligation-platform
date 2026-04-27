"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Obligation, ObligationsFilters } from "@/lib/obligations";
import { PAGE_SIZE } from "@/lib/obligations";
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
  addresseeOptions: Array<{ code: string; label_de: string }>;
};

export function ObligationsBrowser({
  obligations,
  totalCount,
  stats,
  lookups,
  currentFilters,
  addresseeOptions,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Obligation | null>(null);

  const updateFilters = useCallback(
    (updates: Partial<ObligationsFilters>) => {
      const params = new URLSearchParams();
      const merged: ObligationsFilters = { ...currentFilters, ...updates };

      // Filter changes always reset to page 1 unless page itself is being updated
      if (updates.page === undefined) merged.page = 1;

      if (merged.q) params.set("q", merged.q);
      if (merged.source) params.set("source", merged.source);
      if (merged.severity) params.set("severity", merged.severity);
      if (merged.article) params.set("article", merged.article);
      if (merged.addressee) params.set("addressee", merged.addressee);
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
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      {/* Breadcrumb + Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3 w-3" />
          Zurück zur Startseite
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Obligation Browser
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          EU AML/CFT Regulatory Framework (AMLR, AMLD6, ToFR)
        </p>
      </div>

      <StatsCards stats={stats} />

      <FilterBar
        filters={currentFilters}
        addresseeOptions={addresseeOptions}
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
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Seite {currentPage} von {totalPages} ·{" "}
            {totalCount.toLocaleString("de-DE")} Treffer gesamt
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilters({ page: currentPage - 1 })}
              disabled={currentPage <= 1 || isPending}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Vorherige
            </button>
            <button
              onClick={() => updateFilters({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages || isPending}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Nächste
            </button>
          </div>
        </div>
      )}

      <ObligationDrawer
        obligation={selected}
        lookups={lookups}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
