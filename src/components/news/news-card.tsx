"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Loader2, Lightbulb } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { IntelligenceItem, ObligationMatch } from "@/lib/news-types";
import { AUTHORITY_LABELS, URGENCY_LABELS } from "@/lib/news-types";

const AUTHORITY_DOT_DARK: Record<string, string> = {
  AMLA: "bg-indigo-500",
  EBA: "bg-violet-500",
  BAFIN: "bg-emerald-500",
  BaFin: "bg-emerald-500",
  FATF: "bg-amber-500",
};

const URGENCY_DOT_DARK: Record<string, string> = {
  high: "bg-rose-500", High: "bg-rose-500",
  medium: "bg-amber-500", Medium: "bg-amber-500",
  low: "bg-slate-500", Low: "bg-slate-500",
};

const URGENCY_STRIPE_DARK: Record<string, string> = {
  high: "border-l-rose-500", High: "border-l-rose-500",
  medium: "border-l-amber-500", Medium: "border-l-amber-500",
  low: "border-l-slate-700", Low: "border-l-slate-700",
};

export function NewsCard({ item }: { item: IntelligenceItem }) {
  const [expanded, setExpanded] = useState(false);
  const [matches, setMatches] = useState<ObligationMatch[] | null>(null);
  const [loading, setLoading] = useState(false);

  const date = item.published_date
    ? new Date(item.published_date).toLocaleDateString("en-US", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const authority = item.source_authority ?? "";
  const authorityDot = AUTHORITY_DOT_DARK[authority] ?? "bg-slate-500";
  const authorityLabel = AUTHORITY_LABELS[authority] ?? authority;

  const urgency = item.urgency ?? "";
  const urgencyDot = URGENCY_DOT_DARK[urgency] ?? "bg-slate-500";
  const urgencyStripe = URGENCY_STRIPE_DARK[urgency] ?? "border-l-slate-700";
  const urgencyLabel = URGENCY_LABELS[urgency] ?? urgency;

  async function toggle() {
    if (!expanded && matches === null) {
      setLoading(true);
      const supabase = createClient();
      const { data: matchData, error } = await supabase.rpc(
        "match_obligations_for_intel",
        { p_intel_id: item.id, p_max: 8 }
      );
      if (error || !matchData || matchData.length === 0) {
        setMatches([]);
      } else {
        const ids = matchData.map((m: { obligation_id: string }) => m.obligation_id);
        const { data: oblig } = await supabase
          .from("obligations")
          .select("id, primary_source_id, primary_article_ref, requirement_text_plain, severity")
          .in("id", ids);
        const obligMap = new Map(
          (oblig ?? []).map((o: { id: string; [k: string]: unknown }) => [o.id, o])
        );
        const merged = matchData
          .map((m: { obligation_id: string; score: number; reasons: string[] }) => ({
            ...m, ...(obligMap.get(m.obligation_id) ?? {}),
          }))
          .sort((a: ObligationMatch, b: ObligationMatch) => b.score - a.score);
        setMatches(merged as ObligationMatch[]);
      }
      setLoading(false);
    }
    setExpanded((p) => !p);
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-800 border-l-4 ${urgencyStripe} bg-slate-900 transition-colors hover:border-slate-700 hover:border-l-current`}>
      <div className="p-4">
        <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
          {authority && (
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${authorityDot}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {authorityLabel}
              </span>
            </div>
          )}
          {urgency && (
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${urgencyDot}`} />
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                {urgencyLabel}
              </span>
            </div>
          )}
          {date && <span className="ml-auto text-xs tabular-nums text-slate-500">{date}</span>}
          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300"
              aria-label="Open source"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <h3 className="text-sm font-semibold leading-snug text-slate-50">{item.title}</h3>

        {item.body && (
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.body}</p>
        )}

        {item.action_note && (
          <div className="mt-3 rounded-md border border-amber-900/40 bg-amber-950/30 px-3 py-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-semibold text-amber-300">Handlungsempfehlung: </span>
                <span className="text-amber-300/80">{item.action_note}</span>
              </div>
            </div>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {item.tags.map((t) => (
              <span key={t} className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400">{t}</span>
            ))}
          </div>
        )}

        <button
          onClick={toggle}
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
        >
          {expanded ? (
            <>Verwandte Pflichten ausblenden <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Verwandte Pflichten anzeigen <ChevronDown className="h-3 w-3" /></>
          )}
        </button>

        {expanded && (
          <div className="mt-2.5 rounded-md border border-slate-800 bg-slate-950 p-3">
            {loading ? (
              <div className="flex items-center justify-center py-3 text-xs text-slate-500">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Searching obligations...
              </div>
            ) : matches && matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((m) => (
                  <li key={m.obligation_id} className="flex items-start gap-2 text-[11px]">
                    <span className="mt-0.5 shrink-0 font-mono text-slate-500">
                      {(m.primary_source_id ?? "").split("_")[0]} {m.primary_article_ref ?? ""}
                    </span>
                    <span className="flex-1 leading-relaxed text-slate-300">
                      {m.requirement_text_plain
                        ? m.requirement_text_plain.length > 200
                          ? m.requirement_text_plain.slice(0, 200) + "..."
                          : m.requirement_text_plain
                        : <em className="text-slate-500">No text</em>}
                    </span>
                    <span className="shrink-0 tabular-nums text-slate-500">score {m.score}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-center text-xs text-slate-500">No related obligations found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
