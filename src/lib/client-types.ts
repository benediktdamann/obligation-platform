export type SprintEngagement = {
  id: string;
  customer_name: string;
  customer_slug: string;
  customer_industry: string | null;
  customer_size: string | null;
  customer_country: string;
  primary_contact_name: string | null;
  primary_contact_role: string | null;
  primary_contact_email: string | null;
  engagement_type: string;
  status: string;
  start_date: string | null;
  target_completion_date: string | null;
  actual_completion_date: string | null;
  fixed_price_eur: number | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EngagementStats = {
  total: number;
  not_assessed: number;
  missing: number;
  partial: number;
  adequate: number;
  strong: number;
  open_count: number;
  in_progress_count: number;
  resolved_count: number;
  total_effort_days: number;
  high_priority_open: number;
};

export const ENGAGEMENT_TYPE_LABELS: Record<string, string> = {
  amlr_sprint: "AMLR Readiness Sprint",
  amla_response: "AMLA Data Response",
  dora_assessment: "DORA Assessment",
  retainer: "Retainer",
  other: "Other",
};

export const STATUS_LABELS: Record<string, string> = {
  lead: "Lead", active: "Active", completed: "Completed", paused: "Paused", cancelled: "Cancelled",
};

export const STATUS_DOT: Record<string, string> = {
  lead: "bg-slate-500", active: "bg-emerald-500", completed: "bg-indigo-500",
  paused: "bg-amber-500", cancelled: "bg-rose-500",
};

export const INDUSTRY_LABELS: Record<string, string> = {
  "payment-services": "Payment Services",
  "e-money": "E-Money Institution",
  "neo-bank": "Neo-Bank",
  "casp": "CASP / Crypto",
  "kvg": "KVG / Investment",
  "credit-institution": "Credit Institution",
  "other": "Other",
};

export const SIZE_LABELS: Record<string, string> = {
  "<50": "< 50 FTE",
  "50-200": "50–200 FTE",
  "200-500": "200–500 FTE",
  "500+": "500+ FTE",
};
