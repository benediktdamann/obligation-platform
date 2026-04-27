"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Obligation, ObligationsFilters } from "@/lib/obligation-types";
import type { SerializableLookups } from "@/lib/lookup-types";
import { translateCode } from "@/lib/lookup-types";

// ── Colour maps ──────────────────────────────────────────────────────────────

const SOURCE_CLS: Record<string, string> = {
  AMLR: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  AMLD6: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50",
  ToFR: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50",
};

const SEVERITY_CLS: Record<string, string> = {
  mandatory: "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
  conditional:
    "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-50",
  recommended: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
};

// ── Sub-components ───────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: string | null }) {
  if (!source) return <span className="text-muted-foreground">—</span>;
  return (
    <Badge
      className={`border font-mono text-xs ${SOURCE_CLS[source] ?? "bg-muted text-foreground"}`}
    >
      {source}
    </Badge>
  );
}

function SeverityBadge({
  code,
  lookups,
}: {
  code: string | null;
  lookups: SerializableLookups;
}) {
  if (!code) return <span className="text-muted-foreground">—</span>;
  return (
    <Badge
      className={`border text-xs whitespace-nowrap ${SEVERITY_CLS[code.toLowerCase()] ?? "bg-muted text-foreground"}`}
    >
      {translateCode(code, lookups.severities)}
    </Badge>
  );
}

function TypesBadges({
  types,
  lookups,
}: {
  types: string[] | null;
  lookups: SerializableLookups;
}) {
  if (!types?.length) return <span className="text-muted-foreground">—</span>;
  const visible = types.slice(0, 2);
  const rest = types.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((t) => (
        <Badge key={t} variant="secondary" className="text-xs">
          {translateCode(t, lookups.obligationTypes)}
        </Badge>
      ))}
      {rest > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{rest}
        </Badge>
      )}
    </div>
  );
}

function AddresseeCell({
  addressee_categories,
  applicable_entity_types,
  lookups,
}: {
  addressee_categories: string[] | null;
  applicable_entity_types: string[] | null;
  lookups: SerializableLookups;
}) {
  const cats = addressee_categories ?? [];
  const types = applicable_entity_types ?? [];
  if (!cats.length) return <span className="text-muted-foreground">—</span>;
  const primary = translateCode(cats[0], lookups.addresseeCategories);
  const moreCats = cats.length > 1 ? ` +${cats.length - 1}` : "";
  const typeLabel =
    types.length > 0 ? (
      <span className="text-muted-foreground"> ({types.length} Typen)</span>
    ) : null;
  return (
    <span className="text-sm whitespace-nowrap">
      {primary}
      {moreCats}
      {typeLabel}
    </span>
  );
}

// ── Sortable header ──────────────────────────────────────────────────────────

type SortableHeadProps = {
  label: string;
  field: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort: (field: string, dir: "asc" | "desc") => void;
  className?: string;
};

function SortableHead({
  label,
  field,
  sortBy,
  sortDir,
  onSort,
  className,
}: SortableHeadProps) {
  const active = sortBy === field;
  const nextDir = active && sortDir === "asc" ? "desc" : "asc";
  const Icon = active
    ? sortDir === "asc"
      ? ChevronUp
      : ChevronDown
    : ChevronsUpDown;
  return (
    <TableHead
      className={`cursor-pointer select-none hover:bg-muted/70 ${className ?? ""}`}
      onClick={() => onSort(field, nextDir)}
    >
      <div className="flex items-center gap-1">
        {label}
        <Icon className={`h-3 w-3 ${active ? "opacity-100" : "opacity-40"}`} />
      </div>
    </TableHead>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="border-b bg-muted/50 px-4 py-3">
        <Skeleton className="h-4 w-48" />
      </div>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 border-b px-4 py-3.5 last:border-0"
        >
          <Skeleton className="h-4 w-12 shrink-0" />
          <Skeleton className="h-4 w-20 shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24 shrink-0" />
          <Skeleton className="h-4 w-28 shrink-0" />
          <Skeleton className="h-4 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

type Props = {
  obligations: Obligation[];
  lookups: SerializableLookups;
  filters: ObligationsFilters;
  isPending: boolean;
  onRowClick: (o: Obligation) => void;
  onSort: (field: string, dir: "asc" | "desc") => void;
};

export function ObligationsTable({
  obligations,
  lookups,
  filters,
  isPending,
  onRowClick,
  onSort,
}: Props) {
  if (isPending) return <TableSkeleton />;

  if (!obligations.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <p className="text-sm font-medium">Keine Anforderungen gefunden</p>
        <p className="text-xs text-muted-foreground">
          Versuche die Filter zurückzusetzen oder einen anderen Suchbegriff.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/50">
            <TableRow className="hover:bg-transparent border-b">
              <SortableHead
                label="Quelle"
                field="primary_source_id"
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
                onSort={onSort}
                className="w-16"
              />
              <SortableHead
                label="Referenz"
                field="primary_article_ref"
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
                onSort={onSort}
                className="w-28"
              />
              <TableHead>Anforderung</TableHead>
              <TableHead className="w-44">Impact-Area</TableHead>
              <TableHead className="w-44">Verpflichtete</TableHead>
              <SortableHead
                label="Pflichtgrad"
                field="severity"
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
                onSort={onSort}
                className="w-32"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligations.map((o, idx) => {
              const ref = [o.primary_article_ref, o.paragraph_ref]
                .filter(Boolean)
                .join(" §");
              const text = o.requirement_text_plain ?? "";

              return (
                <TableRow
                  key={o.id ?? idx}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => onRowClick(o)}
                >
                  <TableCell className="py-3">
                    <SourceBadge source={o.primary_source_id} />
                  </TableCell>
                  <TableCell className="py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
                    {ref || "—"}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-muted-foreground">
                    <span className="line-clamp-2 leading-relaxed">{text}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <TypesBadges
                      types={o.obligation_types}
                      lookups={lookups}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <AddresseeCell
                      addressee_categories={o.addressee_categories}
                      applicable_entity_types={o.applicable_entity_types}
                      lookups={lookups}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <SeverityBadge code={o.severity} lookups={lookups} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
