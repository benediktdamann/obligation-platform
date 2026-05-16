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
  AMLA: "border-blue-300 bg-blue-100 text-blue-900",
  EBA: "border-purple-300 bg-purple-100 text-purple-900",
  BAFIN: "border-green-300 bg-green-100 text-green-900",
  BaFin: "border-green-300 bg-green-100 text-green-900",
  FATF: "border-orange-300 bg-orange-100 text-orange-900",
};

export const URGENCY_LABELS: Record<string, string> = {
  high: "Hoch", High: "Hoch",
  medium: "Mittel", Medium: "Mittel",
  low: "Niedrig", Low: "Niedrig",
};

export const URGENCY_CLS: Record<string, string> = {
  high: "border-red-300 bg-red-100 text-red-900",
  High: "border-red-300 bg-red-100 text-red-900",
  medium: "border-yellow-300 bg-yellow-100 text-yellow-900",
  Medium: "border-yellow-300 bg-yellow-100 text-yellow-900",
  low: "border-slate-300 bg-slate-100 text-slate-700",
  Low: "border-slate-300 bg-slate-100 text-slate-700",
};

export const NEWS_PAGE_SIZE = 25;
