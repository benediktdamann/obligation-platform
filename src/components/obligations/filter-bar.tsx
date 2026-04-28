"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ObligationsFilters } from "@/lib/obligation-types";
import type { SerializableLookups, LookupMap } from "@/lib/lookup-types";

const SELECT_CLS =
  "h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 text-foreground";

function sortedOptions(map: LookupMap) {
  return Object.values(map).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
}

type Props = {
  filters: ObligationsFilters;
  lookups: SerializableLookups;
  onFilterChange: (updates: Partial<ObligationsFilters>) => void;
  isPending: boolean;
};

export function FilterBar({ filters, lookups, onFilterChange, isPending }: Props) {
  const [localSearch, setLocalSearch] = useState(filters.q ?? "");
  const [localArticle, setLocalArticle] = useState(filters.article ?? "");
  const searchRef = useRef<HTMLInputElement>(null);

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
    filters.obligedEntity ||
    filters.internalStakeholder ||
    filters.regulatoryAuthority
  );

  function handleReset() {
    setLocalSearch("");
    setLocalArticle("");
    onFilterChange({
      q: undefined,
      source: undefined,
      severity: undefined,
      article: undefined,
      obligedEntity: undefined,
      internalStakeholder: undefined,
      regulatoryAuthority: undefined,
    });
  }

  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
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
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
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

        {/* Pflichtgrad */}
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
          className="h-9 w-28 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        />

        {/* Verpflichtete — codes from lookup_obliged_entities */}
        <select
          value={filters.obligedEntity ?? ""}
          onChange={(e) =>
            onFilterChange({ obligedEntity: e.target.value || undefined })
          }
          className={SELECT_CLS}
        >
          <option value="">Alle Verpflichteten</option>
          {sortedOptions(lookups.obligedEntities).map((e) => (
            <option key={e.code} value={e.code}>
              {e.label_de}
            </option>
          ))}
        </select>

        {/* Interne Stakeholder — codes from lookup_internal_stakeholders */}
        <select
          value={filters.internalStakeholder ?? ""}
          onChange={(e) =>
            onFilterChange({ internalStakeholder: e.target.value || undefined })
          }
          className={SELECT_CLS}
        >
          <option value="">Alle Stakeholder</option>
          {sortedOptions(lookups.internalStakeholders).map((e) => (
            <option key={e.code} value={e.code}>
              {e.label_de}
            </option>
          ))}
        </select>

        {/* Aufsicht — codes from lookup_regulatory_authorities */}
        <select
          value={filters.regulatoryAuthority ?? ""}
          onChange={(e) =>
            onFilterChange({ regulatoryAuthority: e.target.value || undefined })
          }
          className={SELECT_CLS}
        >
          <option value="">Alle Aufsicht</option>
          {sortedOptions(lookups.regulatoryAuthorities).map((e) => (
            <option key={e.code} value={e.code}>
              {e.label_de}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}

          {hasFilters && (
            <button
              onClick={handleReset}
              className="flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Zurücksetzen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
