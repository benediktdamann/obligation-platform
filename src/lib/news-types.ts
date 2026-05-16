export type IntelligenceItem = {
  id: string;
  source_authority: string;
  urgency: string;
  published_date: string;
  published_time: string | null;
  title: string;
  body: string;
  action_note: string | null;
  source_url: string | null;
  linked_obligations: string[] | null;
  linked_source_ids: string[] | null;
  affected_entity_types: string[] | null;
  tags: string[] | null;
};

export type ObligationMatch = {
  obligation_id: string;
  score: number;
  reasons: string[];
  primary_source_id?: string | null;
  primary_article_ref?: string | null;
  requirement_text_plain?: string | null;
  severity?: string | null;
};

export const AUTHORITY_LABELS: Record<string, string> = {
  AMLA: "AMLA", EBA: "EBA", BAFIN: "BaFin", BaFin: "BaFin", FATF: "FATF",
};

export const AUTHORITY_CLS: Record<string, string> = {
  AMLA: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400",
  EBA: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-400",
  BAFIN: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
  BaFin: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
  FATF: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
};

export const URGENCY_LABELS: Record<string, string> = {
  high: "High", High: "High",
  medium: "Medium", Medium: "Medium",
  low: "Low", Low: "Low",
};

export const URGENCY_STRIPE: Record<string, string> = {
  high: "border-l-rose-500", High: "border-l-rose-500",
  medium: "border-l-amber-500", Medium: "border-l-amber-500",
  low: "border-l-slate-300", Low: "border-l-slate-300",
};

export const URGENCY_DOT: Record<string, string> = {
  high: "bg-rose-500", High: "bg-rose-500",
  medium: "bg-amber-500", Medium: "bg-amber-500",
  low: "bg-slate-400", Low: "bg-slate-400",
};

export const NEWS_PAGE_SIZE = 25;
