import { NextRequest, NextResponse } from "next/server";
import { generateExcelExport } from "@/lib/excel-export";
import { getEngagementBySlug, getEngagementStats } from "@/lib/clients";
import { getGapAssessments } from "@/lib/assessments";
import { INDUSTRY_TO_ENTITY } from "@/lib/assessment-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { slug } = await params;

  const engagement = await getEngagementBySlug(slug);
  if (!engagement) return new NextResponse("Not found", { status: 404 });

  const stats = await getEngagementStats(engagement.id);

  const exportAll = req.nextUrl.searchParams.get("all") === "true";

  const rows = exportAll
    ? await getGapAssessments(engagement.id)
    : await getGapAssessments(engagement.id, {
        source: "AMLR_2024_1624",
        severity: "mandatory",
        entityType: engagement.customer_industry
          ? INDUSTRY_TO_ENTITY[engagement.customer_industry]
          : undefined,
      });

  const buffer = await generateExcelExport(engagement, stats, rows);

  const today = new Date().toISOString().split("T")[0];
  const filename = `${engagement.customer_slug}-gap-assessment-${today}.xlsx`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
