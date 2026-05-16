import { notFound } from "next/navigation";
import { getEngagementBySlug, getEngagementStats } from "@/lib/clients";
import { getGapAssessments } from "@/lib/assessments";
import { INDUSTRY_TO_ENTITY } from "@/lib/assessment-types";
import { GapEditor } from "@/components/clients/gap-editor";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{
  source?: string;
  severity?: string;
  entity?: string;
  maturity?: string;
  q?: string;
}>;

export default async function AssessmentPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const engagement = await getEngagementBySlug(slug);
  if (!engagement) notFound();

  const defaultEntity = engagement.customer_industry
    ? INDUSTRY_TO_ENTITY[engagement.customer_industry]
    : undefined;

  // If no filter params given, apply sensible defaults
  const hasAnyFilter = sp.source || sp.severity || sp.entity || sp.maturity || sp.q;
  const filters = hasAnyFilter
    ? {
        source: sp.source,
        severity: sp.severity,
        entityType: sp.entity,
        maturity: sp.maturity,
        q: sp.q,
      }
    : {
        source: "AMLR_2024_1624",
        severity: "mandatory",
        entityType: defaultEntity,
      };

  const [rows, stats] = await Promise.all([
    getGapAssessments(engagement.id, filters),
    getEngagementStats(engagement.id),
  ]);

  return (
    <GapEditor
      engagement={engagement}
      initialRows={rows}
      stats={stats}
      currentFilters={filters}
    />
  );
}
