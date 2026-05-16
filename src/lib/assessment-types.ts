export type GapAssessmentRow = {
  gap_id: string;
  engagement_id: string;
  maturity: string;
  current_state: string | null;
  gap_description: string | null;
  recommended_action: string | null;
  effort_days: number | null;
  priority: number | null;
  status: string;
  internal_notes: string | null;
  obligation_id: string;
  primary_source_id: string | null;
  primary_article_ref: string | null;
  paragraph_ref: string | null;
  requirement_text_plain: string | null;
  severity: string | null;
  obligation_types: string[] | null;
  addressee_categories: string[] | null;
  applicable_entity_types: string[] | null;
  checklist_items: string[] | null;
  implementation_guidance: string | null;
};

export type AssessmentFilters = {
  source?: string;
  severity?: string;
  entityType?: string;
  maturity?: string;
  q?: string;
};

export const MATURITY_OPTIONS = [
  { value: "not_assessed", label: "Not Assessed" },
  { value: "missing", label: "Missing" },
  { value: "partial", label: "Partial" },
  { value: "adequate", label: "Adequate" },
  { value: "strong", label: "Strong" },
] as const;

export const MATURITY_LABELS: Record<string, string> = Object.fromEntries(
  MATURITY_OPTIONS.map(o => [o.value, o.label])
);

export const MATURITY_DOTS: Record<string, string> = {
  not_assessed: "bg-slate-500",
  missing: "bg-rose-500",
  partial: "bg-amber-500",
  adequate: "bg-blue-500",
  strong: "bg-emerald-500",
};

export const MATURITY_CHIP: Record<string, string> = {
  not_assessed: "bg-slate-800 text-slate-300 ring-1 ring-slate-700",
  missing: "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40",
  partial: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40",
  adequate: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40",
  strong: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40",
};

export const SEVERITY_LABELS: Record<string, string> = {
  mandatory: "Verbindlich",
  conditional: "Bedingt",
  recommended: "Empfohlen",
};

export const SEVERITY_CHIP: Record<string, string> = {
  mandatory: "border-rose-500/40 text-rose-300 bg-rose-500/10",
  conditional: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  recommended: "border-slate-500/40 text-slate-400 bg-slate-500/10",
};

export const SOURCE_LABELS: Record<string, string> = {
  AMLR_2024_1624: "AMLR",
  AMLD6_2024_1640: "AMLD6",
  TOFR_2023_1113: "ToFR",
  AMLA_REG_2024_1620: "AMLA Reg",
  GWG_DE_2017: "GwG",
  FATF_REC_2024: "FATF",
  BAFIN_AUA_GWG_2026: "BaFin AuA",
};

export const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "wont_fix", label: "Won't Fix" },
  { value: "deferred", label: "Deferred" },
] as const;

// Maps customer_industry to applicable_entity_types value
export const INDUSTRY_TO_ENTITY: Record<string, string> = {
  "payment-services": "payment_institution",
  "e-money": "electronic_money_institution",
  "neo-bank": "credit_institution",
  "credit-institution": "credit_institution",
  "casp": "casp",
  "kvg": "asset_manager",
};
