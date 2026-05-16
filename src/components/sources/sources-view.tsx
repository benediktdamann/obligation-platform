import { ExternalLink, CheckCircle2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import type { RegulatorySource } from "@/lib/sources";

export function SourcesView({ sources }: { sources: RegulatorySource[] }) {
  const grouped = sources.reduce<Record<string, RegulatorySource[]>>((acc, s) => {
    const key = s.source_type ?? "other";
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Sources</h1>
          <p className="mt-1 text-sm text-slate-400">Regulatorische Quellen, aus denen Obligations extrahiert werden</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPI label="Quellen" value={sources.length.toString()} />
          <KPI label="Verordnungen" value={(grouped.regulation?.length ?? 0).toString()} />
          <KPI label="Richtlinien" value={(grouped.directive?.length ?? 0).toString()} />
          <KPI label="Crawler aktiv" value={sources.filter(s => s.crawl_enabled).length.toString()} />
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([type, items]) => (
            <section key={type}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {type} <span className="text-slate-600">· {items.length}</span>
              </h2>
              <div className="space-y-2">
                {items.map((s) => (
                  <div key={s.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {s.short_name && (
                            <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">{s.short_name}</span>
                          )}
                          {s.jurisdiction_code && (
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">{s.jurisdiction_code}</span>
                          )}
                          {s.crawl_enabled && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Crawler
                            </span>
                          )}
                          {s.applies_from && (
                            <span className="ml-auto text-[10px] tabular-nums text-slate-500">
                              gültig ab {new Date(s.applies_from).toLocaleDateString("de-DE")}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 text-sm font-semibold text-slate-50">{s.full_name}</h3>
                        {s.description && (
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-400 line-clamp-2">{s.description}</p>
                        )}
                      </div>
                      {s.source_url && (
                        <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-slate-500 hover:text-slate-300" aria-label="Quelle öffnen">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold tabular-nums text-slate-50">{value}</div>
    </div>
  );
}
