import "server-only";
import { createServerClient } from "@/lib/supabase/server";

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
  jurisdiction: string | null;
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

const ALLOWED_SORT_FIELDS = new Set([
  "primary_source_id",
  "primary_article_ref",
  "severity",
]);

const SELECT_FIELDS = [
  "id",
  "primary_source_id",
  "primary_article_ref",
  "paragraph_ref",
  "requirement_text_plain",
  "severity",
  "obligation_types",
  "addressee_categories",
  "applicable_entity_types",
  "jurisdiction",
  "effective_from",
  "implementation_guidance",
  "checklist_items",
].join(", ");

export async function getObligations(
  filters: ObligationsFilters
): Promise<{ obligations: Obligation[]; totalCount: number }> {
  const supabase = await createServerClient();
  const page = Math.max(1, filters.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("obligations")
    .select(SELECT_FIELDS, { count: "exact" })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filters.q)
    query = query.ilike("requirement_text_plain", `%${filters.q}%`);
  if (filters.source) query = query.eq("primary_source_id", filters.source);
  if (filters.severity) query = query.eq("severity", filters.severity);
  if (filters.article)
    query = query.ilike("primary_article_ref", `%${filters.article}%`);
  if (filters.addressee)
    query = query.contains("addressee_categories", [filters.addressee]);

  const sortField =
    filters.sortBy && ALLOWED_SORT_FIELDS.has(filters.sortBy)
      ? filters.sortBy
      : null;

  if (sortField) {
    query = query.order(sortField, { ascending: filters.sortDir !== "desc" });
  } else {
    query = query
      .order("primary_source_id")
      .order("primary_article_ref");
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    obligations: (data ?? []) as unknown as Obligation[],
    totalCount: count ?? 0,
  };
}

export async function getStats() {
  const supabase = await createServerClient();

  const [total, mandatory, conditional, recommended] = await Promise.all([
    supabase.from("obligations").select("*", { count: "exact", head: true }),
    supabase
      .from("obligations")
      .select("*", { count: "exact", head: true })
      .eq("severity", "mandatory"),
    supabase
      .from("obligations")
      .select("*", { count: "exact", head: true })
      .eq("severity", "conditional"),
    supabase
      .from("obligations")
      .select("*", { count: "exact", head: true })
      .eq("severity", "recommended"),
  ]);

  return {
    total: total.count ?? 0,
    mandatory: mandatory.count ?? 0,
    conditional: conditional.count ?? 0,
    recommended: recommended.count ?? 0,
  };
}
