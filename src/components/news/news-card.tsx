"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { IntelligenceItem, ObligationMatch } from "@/lib/news-types";
import { AUTHORITY_LABELS, AUTHORITY_CLS } from "@/lib/news-types";

export function NewsCard({ item }: { item: IntelligenceItem }) {
  const [expanded, setExpanded] = useState(false);
  const [matches, setMatches] = useState<ObligationMatch[] | null>(null);
  const [loading, setLoading] = useState(false);

  const date = item.published_at
    ? new Date(item.published_at).toLocaleDateString("de-DE", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : null;

  const authority = item.source_authority ?? "";
  const authorityClass = AUTHORITY_CLS[authority] ?? "bg-muted";
  const authorityLabel = AUTHORITY_LABELS[authority] ?? authority;

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
            ...m,
            ...(obligMap.get(m.obligation_id) ?? {}),
          }))
          .sort((a: ObligationMatch, b: ObligationMatch) => b.score - a.score);
        setMatches(merged as ObligationMatch[]);
      }
      setLoading(false);
    }
    setExpanded((p) => !p);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {authority && (
              <Badge className={`border text-xs whitespace-nowrap ${authorityClass}`}>
                {authorityLabel}
              </Badge>
            )}
            {date && <span className="text-xs text-muted-foreground tabular-nums">{date}</span>}
          </div>
          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Quelle öffnen"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <h3 className="mt-2 font-semibold text-base leading-snug">{item.title}</h3>
      </CardHeader>

      <CardContent className="pt-0">
        {item.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        )}

        <button
          onClick={toggle}
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? (
            <>Verwandte Pflichten ausblenden <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Verwandte Pflichten anzeigen <ChevronDown className="h-3 w-3" /></>
          )}
        </button>

        {expanded && (
          <div className="mt-3 rounded-md bg-muted/30 p-3">
            {loading ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suche Pflichten...
              </div>
            ) : matches && matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map((m) => (
                  <li key={m.obligation_id} className="flex items-start gap-2 text-xs">
                    <span className="shrink-0 font-mono text-muted-foreground mt-0.5">
                      {(m.primary_source_id ?? "").split("_")[0]} {m.primary_article_ref ?? ""}
                    </span>
                    <span className="flex-1 leading-relaxed">
                      {m.requirement_text_plain
                        ? m.requirement_text_plain.length > 200
                          ? m.requirement_text_plain.slice(0, 200) + "..."
                          : m.requirement_text_plain
                        : <em className="text-muted-foreground">Kein Text</em>}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      score {m.score}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-center text-xs text-muted-foreground">
                Keine verwandten Pflichten gefunden.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
