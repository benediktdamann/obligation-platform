import Link from "next/link";
import { ChevronLeft, Euro, Calendar, User, Building2, FileSpreadsheet, ListChecks } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import type { SprintEngagement, EngagementStats } from "@/lib/client-types";
import { ENGAGEMENT_TYPE_LABELS, STATUS_LABELS, STATUS_DOT, INDUSTRY_LABELS, SIZE_LABELS } from "@/lib/client-types";

export function ClientDetail({ engagement: e, stats }: { engagement: SprintEngagement; stats: EngagementStats | null }) {
  const assessedPercent = stats && stats.total > 0
    ? Math.round(((stats.total - stats.not_assessed) / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <Link href="/clients" className="mb-4 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
          <ChevronLeft className="h-3 w-3" /> Alle Mandate
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[e.status] ?? "bg-slate-500"}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{STATUS_LABELS[e.status] ?? e.status}</span>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{ENGAGEMENT_TYPE_LABELS[e.engagement_type] ?? e.engagement_type}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50">{e.customer_name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/clients/${e.customer_slug}/assessment`} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400">
              <ListChecks className="h-3.5 w-3.5" /> Gap-Assessment
            </Link>
            <a href={`/api/clients/${e.customer_slug}/export`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel-Export
            </a>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPI label="Obligations" value={stats?.total.toString() ?? "—"} sub={`${stats?.not_assessed ?? 0} unbearbeitet`} />
          <KPI label="Bearbeitet" value={`${assessedPercent}%`} sub={`${(stats?.total ?? 0) - (stats?.not_assessed ?? 0)} / ${stats?.total ?? 0}`} accent="text-indigo-400" />
          <KPI label="Missing+Partial" value={`${(stats?.missing ?? 0) + (stats?.partial ?? 0)}`} sub="Hauptlücken" accent="text-rose-400" />
          <KPI label="Effort" value={`${stats?.total_effort_days?.toFixed(1) ?? "0"}d`} sub="geschätzter Aufwand" accent="text-amber-400" />
        </div>

        <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Kunde</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Info icon={Building2} label="Industrie" value={INDUSTRY_LABELS[e.customer_industry ?? ""] ?? e.customer_industry ?? "—"} />
            <Info icon={User} label="Größe" value={SIZE_LABELS[e.customer_size ?? ""] ?? e.customer_size ?? "—"} />
            <Info icon={Building2} label="Land" value={e.customer_country} />
            <Info icon={Euro} label="Festpreis" value={e.fixed_price_eur ? `€${Number(e.fixed_price_eur).toLocaleString("de-DE")}` : "—"} />
          </div>
        </div>

        {e.primary_contact_name && (
          <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Kontakt</h2>
            <div className="text-sm">
              <div className="font-semibold text-slate-50">{e.primary_contact_name}</div>
              {e.primary_contact_role && <div className="text-slate-400">{e.primary_contact_role}</div>}
              {e.primary_contact_email && <a href={`mailto:${e.primary_contact_email}`} className="text-xs text-indigo-400 hover:text-indigo-300">{e.primary_contact_email}</a>}
            </div>
          </div>
        )}

        <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Zeitplan</h2>
          <div className="grid grid-cols-3 gap-4">
            <Info icon={Calendar} label="Start" value={e.start_date ? new Date(e.start_date).toLocaleDateString("de-DE") : "—"} />
            <Info icon={Calendar} label="Ziel-Abschluss" value={e.target_completion_date ? new Date(e.target_completion_date).toLocaleDateString("de-DE") : "—"} />
            <Info icon={Calendar} label="Tatsächlicher Abschluss" value={e.actual_completion_date ? new Date(e.actual_completion_date).toLocaleDateString("de-DE") : "—"} />
          </div>
        </div>

        {e.internal_notes && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Interne Notizen</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{e.internal_notes}</p>
          </div>
        )}
      </main>
    </div>
  );
}

function KPI({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-2 text-3xl font-bold tabular-nums ${accent ?? "text-slate-50"}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-sm text-slate-200">{value}</div>
    </div>
  );
}
