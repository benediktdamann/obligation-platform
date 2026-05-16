export type IntelligenceItem = {
  id: string;
  source_id: string | null;
  source_authority: string | null;
  title: string;
  summary: string | null;
  published_at: string | null;
  source_url: string | null;
  tags: string[] | null;
  linked_obligations: string[] | null;
};

export type ObligationMatch = {
  obligation_id: string;
  score: number;
  reasons: string[];
  // joined client-side after RPC call
  primary_source_id?: string | null;
  primary_article_ref?: string | null;
  requirement_text_plain?: string | null;
  severity?: string | null;
};

export const AUTHORITY_LABELS: Record<string, string> = {
  AMLA: "AMLA",
  EBA: "EBA",
  BAFIN: "BaFin",
  BaFin: "BaFin",
  FATF: "FATF",
};

export const AUTHORITY_CLS: Record<string, string> = {
  AMLA: "border-blue-200 bg-blue-50 text-blue-700",
  EBA: "border-purple-200 bg-purple-50 text-purple-700",
  BAFIN: "border-green-200 bg-green-50 text-green-700",
  BaFin: "border-green-200 bg-green-50 text-green-700",
  FATF: "border-orange-200 bg-orange-50 text-orange-700",
};

export const NEWS_PAGE_SIZE = 25;
