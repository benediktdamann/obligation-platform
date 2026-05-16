import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export type RegulatorySource = {
  id: string;
  short_name: string | null;
  full_name: string | null;
  source_type: string | null;
  jurisdiction_code: string | null;
  published_date: string | null;
  applies_from: string | null;
  entry_into_force: string | null;
  source_url: string | null;
  description: string | null;
  crawl_enabled: boolean | null;
  last_crawl_at: string | null;
};

export async function getAllSources() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("regulatory_sources")
    .select("id, short_name, full_name, source_type, jurisdiction_code, published_date, applies_from, entry_into_force, source_url, description, crawl_enabled, last_crawl_at")
    .order("applies_from", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as RegulatorySource[];
}
