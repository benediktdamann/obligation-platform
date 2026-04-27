"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ObligationsFilters } from "@/lib/obligations";

const SELECT_CLS =
  "h-8 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50";

type Props = {
  filters: ObligationsFilters;
  addresseeOptions: Array<{ code: string; label_de: string }>;
  onFilterChange: (updates: Partial<ObligationsFilters>) => void;
  isPending: boolean;
};

export function FilterBar({
  filters,
  addresseeOptions,
  onFilterChange,
  isPending,
}: Props) {
  const [localSearch, setLocalSearch] = useState(filters.q ?? "");
  const [localArticle, setLocalArticle] = useState(filters.article ?? "");
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync local state when URL-driven filters change (e.g. after reset)
  useEffect(() => {
    setLocalSearch(filters.q ?? "");
  }, [filters.q]);

  useEffect(() => {
    setLocalArticle(filters.article ?? "");
  }, [filters.article]);

  const hasFilters = !!(
    filters.q ||
    filters.source ||
    filters.severity ||
    filters.article ||
    filters.addressee
  );

  function handleReset() {
    setLocalSearch("");
    setLocalArticle("");
    onFilterChange({
      q: undefined,
      source: undefined,
      severity: undefined,
      article: undefined,
      addressee: undefined,
    });
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {/* Suche */}
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Anforderung durchsuchen..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              onFilterChange({ q: localSearch || undefined });
          }}
          onBlur={() => {
            if ((localSearch || undefined) !== filters.q)
              onFilterChange({ q: localSearch || undefined });
          }}
          className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {/* Quelle */}
      <select
        value={filters.source ?? ""}
        onChange={(e) =>
          onFilterChange({ source: e.target.value || undefined })
        }
        className={SELECT_CLS}
      >
        <option value="">Alle Quellen</option>
        <option value="AMLR">AMLR</option>
        <option value="AMLD6">AMLD6</option>
        <option value="ToFR">ToFR</option>
      </select>

      {/* Severity */}
      <select
        value={filters.severity ?? ""}
        onChange={(e) =>
          onFilterChange({ severity: e.target.value || undefined })
        }
        className={SELECT_CLS}
      >
        <option value="">Alle Pflichten</option>
        <option value="mandatory">Verpflichtend</option>
        <option value="conditional">Bedingt</option>
        <option value="recommended">Empfohlen</option>
      </select>

      {/* Artikel */}
      <input
        type="text"
        placeholder="Art. 10"
        value={localArticle}
        onChange={(e) => setLocalArticle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            onFilterChange({ article: localArticle || undefined });
        }}
        onBlur={() => {
          if ((localArticle || undefined) !== filters.article)
            onFilterChange({ article: localArticle || undefined });
        }}
        className="h-8 w-28 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
      />

      {/* Adressat */}
      <select
        value={filters.addressee ?? ""}
        onChange={(e) =>
          onFilterChange({ addressee: e.target.value || undefined })
        }
        className={SELECT_CLS}
      >
        <option value="">Alle Adressaten</option>
        {addresseeOptions.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label_de}
          </option>
        ))}
      </select>

      {/* Reset */}
      {hasFilters && (
        <button
          onClick={handleReset}
          className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Filter zurücksetzen
        </button>
      )}

      {isPending && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
