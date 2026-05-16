// Client-safe types and helpers for target dates.

export type TargetDate = {
  id: string;
  title: string;
  description: string | null;
  target_date: string; // ISO date 'YYYY-MM-DD'
  category: string;
  source_id: string | null;
  jurisdiction_code: string | null;
  affected_entities: string[] | null;
  status: string;
  external_url: string | null;
  notes: string | null;
};

export type TargetDateBucket = "imminent" | "upcoming" | "strategic" | "completed";

export const CATEGORY_LABELS: Record<string, string> = {
  regulation_apply: "Anwendung",
  supervision_start: "Aufsicht startet",
  consultation_close: "Konsultation endet",
  deadline: "Frist",
  review_milestone: "Review-Meilenstein",
};

export const CATEGORY_CLS: Record<string, string> = {
  regulation_apply: "border-red-200 bg-red-50 text-red-700",
  supervision_start: "border-purple-200 bg-purple-50 text-purple-700",
  consultation_close: "border-yellow-200 bg-yellow-50 text-yellow-700",
  deadline: "border-orange-200 bg-orange-50 text-orange-700",
  review_milestone: "border-blue-200 bg-blue-50 text-blue-700",
};

export function daysUntil(targetDate: string, now: Date = new Date()): number {
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function bucketFor(td: TargetDate, now: Date = new Date()): TargetDateBucket {
  if (td.status === "completed" || td.status === "cancelled") return "completed";
  const days = daysUntil(td.target_date, now);
  if (days < 0) return "completed";
  if (days <= 30) return "imminent";
  if (days <= 180) return "upcoming";
  return "strategic";
}
