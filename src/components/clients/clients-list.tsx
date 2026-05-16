import Link from "next/link";
import { Plus, ArrowUpRight, Building2, Euro, Calendar } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import type { SprintEngagement } from "@/lib/client-types";
import { ENGAGEMENT_TYPE_LABELS, STATUS_LABELS, STATUS_DOT, INDUSTRY_LABELS, SIZE_LABELS } from "@/lib/client-types";

export function ClientsList({ engagements }: { engagements: SprintEngagement[] }) {
  const activeCount = engagements.filter(e => e.status === "active").length;
  const totalValue = engagements
    .filter(e => e.status === "active" || e.status === "completed")
    .reduce((sum, e) => sum + (Number(e.fixed_price_eur) ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">Mandate</h1>
            <p className="mt-1 text-sm text-slate-400">Aktive und abgeschlossene Sprint-Engagements</p>
          </div>
          <Link
            href="/clients/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" /> Neues Mandat
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <KPI label="Aktive Mandate" value={activeCount.toString()} icon={Building2} accent="text-emerald-400" />
          <KPI label="Gesamt" value={engagements.length.toString()} icon={Calendar} accent="text-slate-200" />
          <KPI label="Pipeline-Wert" value={`€${totalValue.toLocaleString("de-DE")}`} icon={Euro} accent="text-indigo-400" />
        </div>

        {engagements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 py-16 text-center">
            <Building2 className="mx-auto mb-3 h-8 w-8 text-slate-700" />
            <p className="text-sm font-medium text-slate-300">Noch keine Mandate</p>
            <p className="mt-1 text-xs text-slate-500">Lege das erste Sprint-Mandat an um zu starten.</p>
            <Link href="/clients/new" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-400">
              <Plus className="h-3.5 w-3.5" /> Neues Mandat
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {engagements.map((e) => (
              <Link key={e.id} href={`/clients/${e.customer_slug}`} className="group block rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[e.status] ?? "bg-slate-500"}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{STATUS_LABELS[e.status] ?? e.status}</span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{ENGAGEMENT_TYPE_LABELS[e.engagement_type] ?? e.engagement_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-50">{e.customer_name}</h3>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-400" />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                      {e.customer_industry && <span>{INDUSTRY_LABELS[e.customer_industry] ?? e.customer_industry}</span>}
                      {e.customer_size && <><span>·</span><span>{SIZE_LABELS[e.customer_size] ?? e.customer_size}</span></>}
                      {e.primary_contact_name && <><span>·</span><span>{e.primary_contact_name}{e.primary_contact_role ? `, ${e.primary_contact_role}` : ""}</span></>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {e.fixed_price_eur != null && (
                      <div className="text-sm font-semibold tabular-nums text-slate-50">€{Number(e.fixed_price_eur).toLocaleString("de-DE")}</div>
                    )}
                    {e.target_completion_date && (
                      <div className="mt-0.5 text-[10px] text-slate-500">
                        Frist: {new Date(e.target_completion_date).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function KPI({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ElementType; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-2 text-3xl font-bold tabular-nums ${accent ?? "text-slate-50"}`}>{value}</div>
    </div>
  );
}
