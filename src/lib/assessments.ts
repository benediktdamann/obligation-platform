import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { GapAssessmentRow, AssessmentFilters } from "./assessment-types";

export async function getGapAssessments(
  engagementId: string,
  filters: AssessmentFilters = {}
): Promise<GapAssessmentRow[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("get_gap_assessments", {
    p_engagement_id: engagementId,
    p_source: filters.source ?? null,
    p_severity: filters.severity ?? null,
    p_entity_type: filters.entityType ?? null,
    p_maturity: filters.maturity ?? null,
    p_search: filters.q ?? null,
    p_limit: 500,
  });
  if (error) throw error;
  return (data ?? []) as GapAssessmentRow[];
}
