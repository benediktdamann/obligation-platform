"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Loader2, Lightbulb } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { IntelligenceItem, ObligationMatch } from "@/lib/news-types";
import { AUTHORITY_LABELS, AUTHORITY_CLS, URGENCY_LABELS, URGENCY_STRIPE, URGENCY_DOT } from "@/lib/news-types";

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
  const authorityClass = AUTHORITY_CLS[authority] ?? "border-slate-200 bg-slate-50 text-slate-700";
  const authorityLabel = AUTHORITY_LABELS[authority] ?? authority;

  const urgency = item.urgency ?? "";
  const stripeClass = URGENCY_STRIPE[urgency] ?? "border-l-slate-300";
  const dotClass = URGENCY_DOT[urgency] ?? "bg-slate-400";
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
    <Card className={`overflow-hidden border-l-4 ${stripeClass} bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900`}>
      <CardHeader className="pb-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {authority && (
            <Badge variant="outline" className={`border text-[10px] font-semibold uppercase tracking-wider ${authorityClass}`}>
              {authorityLabel}
            </Badge>
          )}
          {urgency && (
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {urgencyLabel}
              </span>
            </div>
          )}
          {date && (
            <span className="ml-auto text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {date}
            </span>
          )}
          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label="Open source"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {item.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        {item.body && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {item.body}
          </p>
        )}

        {item.action_note && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold text-amber-900 dark:text-amber-200">Handlungsempfehlung: </span>
                <span className="text-amber-800/90 dark:text-amber-300/80">{item.action_note}</span>
              </div>
            </div>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="border-slate-200 text-[10px] font-normal text-slate-600 dark:border-slate-700 dark:text-slate-400"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}

        <button
          onClick={toggle}
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {expanded ? (
            <>Verwandte Pflichten ausblenden <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Verwandte Pflichten anzeigen <ChevronDown className="h-3 w-3" /></>
          )}
        </button>

        {expanded && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            {loading ? (
              <div className="flex items-center justify-center py-4 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching obligations...
              </div>
            ) : matches && matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((m) => (
                  <li key={m.obligation_id} className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 shrink-0 font-mono text-slate-500 dark:text-slate-400">
                      {(m.primary_source_id ?? "").split("_")[0]} {m.primary_article_ref ?? ""}
                    </span>
                    <span className="flex-1 leading-relaxed text-slate-700 dark:text-slate-300">
                      {m.requirement_text_plain
                        ? m.requirement_text_plain.length > 200
                          ? m.requirement_text_plain.slice(0, 200) + "..."
                          : m.requirement_text_plain
                        : <em className="text-slate-400">No text</em>}
                    </span>
                    <span className="shrink-0 tabular-nums text-slate-400">
                      score {m.score}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-center text-xs text-slate-500 dark:text-slate-400">
                No related obligations found.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
