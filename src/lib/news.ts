import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { IntelligenceItem } from "./news-types";
import { NEWS_PAGE_SIZE } from "./news-types";

export type NewsFilters = {
  authority?: string;
  q?: string;
  page?: number;
};

export async function getNews(filters: NewsFilters = {}) {
  const supabase = await createServerClient();
  const page = Math.max(1, filters.page ?? 1);
  const offset = (page - 1) * NEWS_PAGE_SIZE;

  let q = supabase
    .from("intelligence_items")
    .select(
      "id, source_id, source_authority, title, summary, published_at, source_url, tags, linked_obligations",
      { count: "exact" }
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + NEWS_PAGE_SIZE - 1);

  if (filters.authority) q = q.eq("source_authority", filters.authority);
  if (filters.q) q = q.or(`title.ilike.%${filters.q}%,summary.ilike.%${filters.q}%`);

  const { data, count, error } = await q;
  if (error) throw error;

  return {
    items: (data ?? []) as IntelligenceItem[],
    totalCount: count ?? 0,
  };
}
