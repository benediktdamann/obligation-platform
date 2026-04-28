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
import { sourceLabel, formatObligationRef } from "@/lib/obligation-types";
import type { SerializableLookups } from "@/lib/lookup-types";
import { translateCode } from "@/lib/lookup-types";

// ── Colour maps (keyed by normalized prefix) ─────────────────────────────────

const SOURCE_CLS: Record<string, string> = {
  AMLR: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  AMLD6: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50",
  TOFR: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50",
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
  const label = sourceLabel(source);
  const prefix = source.split("_")[0].toUpperCase();
  const cls = SOURCE_CLS[prefix] ?? "bg-muted text-foreground";
  return (
    <Badge className={`border font-mono text-xs ${cls}`}>{label}</Badge>
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
  obliged_entities,
  internal_stakeholders,
  lookups,
}: {
  obliged_entities: string[] | null;
  internal_stakeholders: string[] | null;
  lookups: SerializableLookups;
}) {
  const entities = obliged_entities ?? [];
  const stakeholders = internal_stakeholders ?? [];

  if (!entities.length && !stakeholders.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="space-y-0.5">
      {entities.length > 0 && (
        <p className="text-sm">
          {entities
            .map((e) => translateCode(e, lookups.obligedEntities))
            .join(", ")}
        </p>
      )}
      {stakeholders.length > 0 && (
        <p className="text-xs text-muted-foreground">
          + Stakeholder:{" "}
          {stakeholders
            .map((s) => translateCode(s, lookups.internalStakeholders))
            .join(", ")}
        </p>
      )}
    </div>
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
    <div className="rounded-xl border">
      <div className="border-b bg-muted/50 px-4 py-3">
        <Skeleton className="h-4 w-48" />
      </div>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b px-4 py-3.5 last:border-0">
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
    <div className="rounded-xl border">
      <Table className="table-fixed">
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow className="hover:bg-transparent border-b">
            <SortableHead
              label="Quelle"
              field="primary_source_id"
              sortBy={filters.sortBy}
              sortDir={filters.sortDir}
              onSort={onSort}
              className="w-[80px]"
            />
            <SortableHead
              label="Referenz"
              field="primary_article_ref"
              sortBy={filters.sortBy}
              sortDir={filters.sortDir}
              onSort={onSort}
              className="w-[130px]"
            />
            <TableHead>Anforderung</TableHead>
            <TableHead className="w-[150px]">Impact-Area</TableHead>
            <TableHead className="w-[180px]">Verpflichtete</TableHead>
            <SortableHead
              label="Pflichtgrad"
              field="severity"
              sortBy={filters.sortBy}
              sortDir={filters.sortDir}
              onSort={onSort}
              className="w-[130px]"
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {obligations.map((o, idx) => {
            const ref = formatObligationRef(
              o.primary_article_ref,
              o.paragraph_ref
            );
            const text = o.requirement_text_plain ?? "";

            return (
              <TableRow
                key={o.id ?? idx}
                className="cursor-pointer transition-colors hover:bg-muted/30"
                onClick={() => onRowClick(o)}
              >
                <TableCell>
                  <SourceBadge source={o.primary_source_id} />
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {ref || "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <span className="line-clamp-2 leading-relaxed">{text}</span>
                </TableCell>
                <TableCell>
                  <TypesBadges types={o.obligation_types} lookups={lookups} />
                </TableCell>
                <TableCell>
                  <AddresseeCell
                    obliged_entities={o.obliged_entities}
                    internal_stakeholders={o.internal_stakeholders}
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
  );
}
