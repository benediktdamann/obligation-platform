import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { SprintEngagement, EngagementStats } from "./client-types";

export async function getAllEngagements() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("sprint_engagements")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SprintEngagement[];
}

export async function getEngagementBySlug(slug: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("sprint_engagements")
    .select("*")
    .eq("customer_slug", slug)
    .maybeSingle();
  return data as SprintEngagement | null;
}

export async function getEngagementStats(engagementId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("engagement_stats", { p_engagement_id: engagementId });
  if (error || !data || data.length === 0) return null;
  return data[0] as EngagementStats;
}
