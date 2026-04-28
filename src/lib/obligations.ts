import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { Obligation, ObligationsFilters } from "@/lib/obligation-types";
import { PAGE_SIZE } from "@/lib/obligation-types";

export type { Obligation, ObligationsFilters };
export { PAGE_SIZE };

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
  "applicable_entity_types",
  "applies_to_jurisdictions",
  "effective_from",
  "implementation_guidance",
  "checklist_items",
  "obliged_entities",
  "internal_stakeholders",
  "regulatory_authorities",
].join(", ");

// Applies WHERE clauses for the given filters to any Supabase query builder.
// Uses `any` because the builder's generic chain type changes with every call.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, filters: ObligationsFilters): any {
  if (filters.q)
    query = query.ilike("requirement_text_plain", `%${filters.q}%`);

  // ilike + prefix so "AMLR" matches "AMLR_2024_1624", case-insensitive for ToFR/TOFR
  if (filters.source)
    query = query.ilike("primary_source_id", `${filters.source}%`);

  if (filters.severity)
    query = query.eq("severity", filters.severity);

  if (filters.article)
    query = query.ilike("primary_article_ref", `%${filters.article}%`);

  // array @> '{code}' — rows where the array contains the specific code
  if (filters.obligedEntity)
    query = query.contains("obliged_entities", [filters.obligedEntity]);
  if (filters.regulatoryAuthority)
    query = query.contains("regulatory_authorities", [filters.regulatoryAuthority]);
  if (filters.internalStakeholder)
    query = query.contains("internal_stakeholders", [filters.internalStakeholder]);

  return query;
}

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

  query = applyFilters(query, filters);

  const sortField =
    filters.sortBy && ALLOWED_SORT_FIELDS.has(filters.sortBy)
      ? filters.sortBy
      : null;

  if (sortField) {
    query = query.order(sortField, { ascending: filters.sortDir !== "desc" });
  } else {
    query = query.order("primary_source_id").order("primary_article_ref");
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    obligations: (data ?? []) as unknown as Obligation[],
    totalCount: count ?? 0,
  };
}

/** Filter-aware severity breakdown. Pass filters to get counts within the active filter set. */
export async function getStats(filters?: ObligationsFilters) {
  const supabase = await createServerClient();

  const base = () =>
    supabase.from("obligations").select("*", { count: "exact", head: true });

  const withF = (q: ReturnType<typeof base>) =>
    filters ? applyFilters(q, filters) : q;

  const [total, mandatory, conditional, recommended] = await Promise.all([
    withF(base()),
    withF(base()).eq("severity", "mandatory"),
    withF(base()).eq("severity", "conditional"),
    withF(base()).eq("severity", "recommended"),
  ]);

  return {
    total: total.count ?? 0,
    mandatory: mandatory.count ?? 0,
    conditional: conditional.count ?? 0,
    recommended: recommended.count ?? 0,
  };
}

/** Always returns the unfiltered total across all obligations. */
export async function getGlobalCount(): Promise<number> {
  const supabase = await createServerClient();
  const { count } = await supabase
    .from("obligations")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}
