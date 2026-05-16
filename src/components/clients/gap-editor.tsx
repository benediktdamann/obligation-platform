"use client";

import { useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, Search, Loader2, Filter, RotateCcw } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { GapRow } from "./gap-row";
import { GapDrawer } from "./gap-drawer";
import type { SprintEngagement, EngagementStats } from "@/lib/client-types";
import type { GapAssessmentRow, AssessmentFilters } from "@/lib/assessment-types";

type Props = {
  engagement: SprintEngagement;
  initialRows: GapAssessmentRow[];
  stats: EngagementStats | null;
  currentFilters: AssessmentFilters;
};

export function GapEditor({ engagement, initialRows, stats, currentFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState<GapAssessmentRow | null>(null);

  // Sync rows when navigation changes filters (Next.js revalidates initialRows)
  if (initialRows !== rows && !isPending) {
    setRows(initialRows);
  }

  const update = useCallback(
    (updates: Partial<AssessmentFilters>) => {
      const params = new URLSearchParams();
      const merged = { ...currentFilters, ...updates };
      if (merged.source) params.set("source", merged.source);
      if (merged.severity) params.set("severity", merged.severity);
      if (merged.entityType) params.set("entity", merged.entityType);
      if (merged.maturity) params.set("maturity", merged.maturity);
      if (merged.q) params.set("q", merged.q);
      const qs = params.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    },
    [currentFilters, pathname, router]
  );

  const reset = () => startTransition(() => router.push(pathname));

  const optimisticUpdate = useCallback(
    (gapId: string, updates: Partial<GapAssessmentRow>) => {
      setRows((prev) => prev.map((r) => (r.gap_id === gapId ? { ...r, ...updates } : r)));
    },
    []
  );

  // Local stats from current view
  const localStats = {
    total: rows.length,
    notAssessed: rows.filter((r) => r.maturity === "not_assessed").length,
    missing: rows.filter((r) => r.maturity === "missing").length,
    partial: rows.filter((r) => r.maturity === "partial").length,
    adequate: rows.filter((r) => r.maturity === "adequate").length,
    strong: rows.filter((r) => r.maturity === "strong").length,
  };

  const selectCls =
    "h-9 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50";

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <Link
          href={`/clients/${engagement.customer_slug}`}
          className="mb-3 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
        >
          <ChevronLeft className="h-3 w-3" /> {engagement.customer_name}
        </Link>

        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Gap Assessment</h1>
          <p className="mt-1 text-sm text-slate-400">
            {rows.length} Pflichten in aktueller Auswahl · {stats?.total ?? 0} insgesamt
          </p>
        </div>

        {/* Mini stats */}
        <div className="mb-4 grid grid-cols-5 gap-2">
          <MiniStat label="Not assessed" value={localStats.notAssessed} dot="bg-slate-500" />
          <MiniStat label="Missing" value={localStats.missing} dot="bg-rose-500" />
          <MiniStat label="Partial" value={localStats.partial} dot="bg-amber-500" />
          <MiniStat label="Adequate" value={localStats.adequate} dot="bg-blue-500" />
          <MiniStat label="Strong" value={localStats.strong} dot="bg-emerald-500" />
        </div>

        {/* Filter bar */}
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Pflicht-Text durchsuchen..."
                defaultValue={currentFilters.q ?? ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    update({ q: (e.target as HTMLInputElement).value || undefined });
                }}
                className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
            <select value={currentFilters.source ?? ""} onChange={(e) => update({ source: e.target.value || undefined })} className={selectCls}>
              <option value="">Alle Quellen</option>
              <option value="AMLR_2024_1624">AMLR</option>
              <option value="AMLD6_2024_1640">AMLD6</option>
              <option value="TOFR_2023_1113">ToFR</option>
              <option value="AMLA_REG_2024_1620">AMLA Reg</option>
              <option value="GWG_DE_2017">GwG</option>
              <option value="FATF_REC_2024">FATF</option>
            </select>
            <select value={currentFilters.severity ?? ""} onChange={(e) => update({ severity: e.target.value || undefined })} className={selectCls}>
              <option value="">Alle Severities</option>
              <option value="mandatory">Verbindlich</option>
              <option value="conditional">Bedingt</option>
              <option value="recommended">Empfohlen</option>
            </select>
            <select value={currentFilters.entityType ?? ""} onChange={(e) => update({ entityType: e.target.value || undefined })} className={selectCls}>
              <option value="">Alle Entity-Types</option>
              <option value="credit_institution">Credit Institution</option>
              <option value="payment_institution">Payment Institution</option>
              <option value="electronic_money_institution">E-Money</option>
              <option value="investment_firm">Investment Firm</option>
              <option value="casp">CASP</option>
              <option value="asset_manager">Asset Manager</option>
              <option value="insurance_company">Insurance</option>
            </select>
            <select value={currentFilters.maturity ?? ""} onChange={(e) => update({ maturity: e.target.value || undefined })} className={selectCls}>
              <option value="">Alle Maturities</option>
              <option value="not_assessed">Not Assessed</option>
              <option value="missing">Missing</option>
              <option value="partial">Partial</option>
              <option value="adequate">Adequate</option>
              <option value="strong">Strong</option>
            </select>
            <button onClick={reset} className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-700 bg-slate-950 px-3 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200" title="Filter zurücksetzen">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 py-16 text-center">
            <Filter className="mx-auto mb-3 h-8 w-8 text-slate-700" />
            <p className="text-sm font-medium text-slate-300">Keine Pflichten in aktueller Auswahl</p>
            <p className="mt-1 text-xs text-slate-500">Filter anpassen oder zurücksetzen.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {rows.map((row) => (
              <GapRow
                key={row.gap_id}
                row={row}
                onClick={() => setSelected(row)}
                onMaturityChange={(maturity) => optimisticUpdate(row.gap_id, { maturity })}
              />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <GapDrawer
          row={selected}
          onClose={() => setSelected(null)}
          onSave={(updates) => {
            optimisticUpdate(selected.gap_id, updates);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value, dot }: { label: string; value: number; dot: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <div className="mt-0.5 text-xl font-bold tabular-nums text-slate-50">{value}</div>
    </div>
  );
}
