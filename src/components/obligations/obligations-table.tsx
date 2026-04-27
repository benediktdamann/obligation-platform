"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  AMLR: "border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100",
  AMLD6: "border-purple-200 bg-purple-100 text-purple-800 hover:bg-purple-100",
  ToFR: "border-orange-200 bg-orange-100 text-orange-800 hover:bg-orange-100",
};

const SEVERITY_CLS: Record<string, string> = {
  mandatory: "border-red-200 bg-red-100 text-red-800 hover:bg-red-100",
  conditional:
    "border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  recommended: "border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100",
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
      className={`cursor-pointer select-none hover:bg-muted/50 ${className ?? ""}`}
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
    <div className="rounded-md border">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 border-b px-3 py-3 last:border-0"
        >
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
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
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed py-16 text-center">
        <p className="text-sm font-medium">Keine Anforderungen gefunden</p>
        <p className="text-xs text-muted-foreground">
          Versuche die Filter zurückzusetzen oder einen anderen Suchbegriff.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
              const truncated =
                text.length > 180 ? text.slice(0, 180) + "…" : text;

              return (
                <TableRow
                  key={o.id ?? idx}
                  className="cursor-pointer"
                  onClick={() => onRowClick(o)}
                >
                  <TableCell>
                    <SourceBadge source={o.primary_source_id} />
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                    {ref || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {truncated}
                  </TableCell>
                  <TableCell>
                    <TypesBadges
                      types={o.obligation_types}
                      lookups={lookups}
                    />
                  </TableCell>
                  <TableCell>
                    <AddresseeCell
                      addressee_categories={o.addressee_categories}
                      applicable_entity_types={o.applicable_entity_types}
                      lookups={lookups}
                    />
                  </TableCell>
                  <TableCell>
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
