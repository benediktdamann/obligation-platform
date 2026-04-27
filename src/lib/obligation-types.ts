// Client-safe: no server imports. Used by both Server Components and Client Components.

export type Obligation = {
  id: string;
  primary_source_id: string | null;
  primary_article_ref: string | null;
  paragraph_ref: string | null;
  requirement_text_plain: string | null;
  severity: string | null;
  obligation_types: string[] | null;
  addressee_categories: string[] | null;
  applicable_entity_types: string[] | null;
  applies_to_jurisdictions: string[] | null;
  effective_from: string | null;
  implementation_guidance: string | null;
  checklist_items: string[] | null;
};

export type ObligationsFilters = {
  q?: string;
  source?: string;
  severity?: string;
  article?: string;
  addressee?: string;
  page?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export const PAGE_SIZE = 50;

const SOURCE_PREFIX_LABELS: Record<string, string> = {
  AMLR: "AMLR",
  AMLD6: "AMLD6",
  TOFR: "ToFR",
};

/** "AMLR_2024_1624" → "AMLR", "TOFR_2023_1113" → "ToFR" */
export function sourceLabel(id: string | null): string {
  if (!id) return "—";
  const prefix = id.split("_")[0].toUpperCase();
  return SOURCE_PREFIX_LABELS[prefix] ?? id;
}

/** "Art. 10" + "10(11)(b)" → "Art. 10 §11(b)" */
export function formatObligationRef(
  articleRef: string | null,
  paragraphRef: string | null
): string {
  if (!articleRef && !paragraphRef) return "";
  if (!paragraphRef) return articleRef ?? "";

  const artNum = articleRef?.match(/(\d+)\s*$/)?.[1];
  let para = paragraphRef;
  if (artNum && para.startsWith(artNum)) {
    para = para.slice(artNum.length);
    para = para.replace(/^\((\d+)\)/, "$1");
  }

  if (!articleRef) return para;
  return para ? `${articleRef} §${para}` : articleRef;
}
