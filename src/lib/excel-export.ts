import "server-only";
import ExcelJS from "exceljs";
import type { SprintEngagement, EngagementStats } from "@/lib/client-types";
import type { GapAssessmentRow } from "@/lib/assessment-types";
import {
  SOURCE_LABELS,
  SEVERITY_LABELS,
  MATURITY_LABELS,
} from "@/lib/assessment-types";

const MATURITY_BG: Record<string, string> = {
  not_assessed: "FFF1F5F9",
  missing: "FFFECDD3",
  partial: "FFFDE68A",
  adequate: "FFBFDBFE",
  strong: "FFA7F3D0",
};

const MATURITY_TEXT: Record<string, string> = {
  not_assessed: "FF475569",
  missing: "FF881337",
  partial: "FF78350F",
  adequate: "FF1E3A8A",
  strong: "FF065F46",
};

const SEVERITY_BG: Record<string, string> = {
  mandatory: "FFFEE2E2",
  conditional: "FFFEF3C7",
  recommended: "FFF1F5F9",
};

const INDIGO = "FF4338CA";
const WHITE = "FFFFFFFF";

export async function generateExcelExport(
  engagement: SprintEngagement,
  stats: EngagementStats | null,
  rows: GapAssessmentRow[]
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Obligation Platform";
  wb.created = new Date();

  buildCoverSheet(wb, engagement, stats);
  buildGapMatrixSheet(wb, rows);
  buildRoadmapSheet(wb, rows);

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}

function buildCoverSheet(
  wb: ExcelJS.Workbook,
  engagement: SprintEngagement,
  stats: EngagementStats | null
) {
  const ws = wb.addWorksheet("Cover", {
    properties: { tabColor: { argb: INDIGO } },
    views: [{ showGridLines: false }],
  });

  ws.columns = [{ width: 32 }, { width: 64 }];

  ws.mergeCells("A1:B1");
  ws.getCell("A1").value = "AMLR Gap Assessment Report";
  ws.getCell("A1").font = { size: 24, bold: true, color: { argb: "FF1E293B" } };
  ws.getRow(1).height = 36;

  ws.mergeCells("A2:B2");
  ws.getCell("A2").value = engagement.customer_name;
  ws.getCell("A2").font = { size: 16, color: { argb: "FF475569" } };
  ws.getRow(2).height = 26;

  let r = 5;
  const meta = (label: string, value: string | number | null | undefined) => {
    ws.getCell(`A${r}`).value = label;
    ws.getCell(`A${r}`).font = { bold: true, color: { argb: "FF475569" } };
    ws.getCell(`B${r}`).value = value ?? "—";
    r++;
  };

  meta("Engagement Type", "AMLR Readiness Sprint");
  meta("Status", engagement.status);
  meta("Industry", engagement.customer_industry);
  meta("Company Size", engagement.customer_size);
  meta("Country", engagement.customer_country);
  meta("Primary Contact", engagement.primary_contact_name);
  meta("Contact Role", engagement.primary_contact_role);
  meta("Start Date", engagement.start_date);
  meta("Target Completion", engagement.target_completion_date);
  meta("Report Generated", new Date().toLocaleString("de-DE"));

  r += 2;
  ws.mergeCells(`A${r}:B${r}`);
  ws.getCell(`A${r}`).value = "Executive Summary";
  ws.getCell(`A${r}`).font = { size: 14, bold: true, color: { argb: "FF1E293B" } };
  r += 2;

  if (stats) {
    const summary: [string, number, string?][] = [
      ["Obligations in Scope", stats.total],
      ["Not Assessed", stats.not_assessed],
      ["Missing", stats.missing, "FFFECDD3"],
      ["Partial", stats.partial, "FFFDE68A"],
      ["Adequate", stats.adequate, "FFBFDBFE"],
      ["Strong", stats.strong, "FFA7F3D0"],
      ["Total Estimated Effort (Days)", stats.total_effort_days],
      ["High Priority Open Items", stats.high_priority_open],
    ];
    for (const [label, value, bg] of summary) {
      ws.getCell(`A${r}`).value = label;
      ws.getCell(`A${r}`).font = { bold: true };
      ws.getCell(`B${r}`).value = value;
      ws.getCell(`B${r}`).font = { bold: true };
      if (bg) {
        ws.getCell(`B${r}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      }
      r++;
    }
  }

  r += 2;
  ws.mergeCells(`A${r}:B${r}`);
  ws.getCell(`A${r}`).value = "Disclaimer";
  ws.getCell(`A${r}`).font = { size: 11, bold: true, color: { argb: "FF1E293B" } };
  r++;
  ws.mergeCells(`A${r}:B${r + 3}`);
  ws.getCell(`A${r}`).value =
    "This gap assessment is based on regulatory requirements of AMLR (EU 2024/1624), AMLD6 (EU 2024/1640), and ToFR (EU 2023/1113). The maturity assessment reflects the consultant's professional opinion based on information provided by the client at the time of the engagement. This document does not constitute legal advice.";
  ws.getCell(`A${r}`).alignment = { wrapText: true, vertical: "top" };
  ws.getCell(`A${r}`).font = { size: 9, italic: true, color: { argb: "FF64748B" } };
}

function buildGapMatrixSheet(wb: ExcelJS.Workbook, rows: GapAssessmentRow[]) {
  const ws = wb.addWorksheet("Gap Matrix", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = [
    { header: "Source", key: "source", width: 10 },
    { header: "Article", key: "article", width: 12 },
    { header: "§", key: "paragraph", width: 10 },
    { header: "Severity", key: "severity", width: 12 },
    { header: "Requirement", key: "requirement", width: 60 },
    { header: "Maturity", key: "maturity", width: 14 },
    { header: "Current State", key: "current_state", width: 40 },
    { header: "Gap", key: "gap", width: 40 },
    { header: "Recommended Action", key: "action", width: 40 },
    { header: "Effort (d)", key: "effort", width: 10 },
    { header: "Priority", key: "priority", width: 10 },
    { header: "Status", key: "status", width: 14 },
    { header: "Notes", key: "notes", width: 30 },
  ];

  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: WHITE }, size: 11 };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INDIGO } };
  header.alignment = { vertical: "middle", horizontal: "left" };
  header.height = 24;

  for (const r of rows) {
    const dr = ws.addRow({
      source: SOURCE_LABELS[r.primary_source_id ?? ""] ?? r.primary_source_id,
      article: r.primary_article_ref,
      paragraph: r.paragraph_ref !== r.primary_article_ref ? r.paragraph_ref : "",
      severity: SEVERITY_LABELS[r.severity ?? ""] ?? r.severity,
      requirement: r.requirement_text_plain,
      maturity: MATURITY_LABELS[r.maturity] ?? r.maturity,
      current_state: r.current_state ?? "",
      gap: r.gap_description ?? "",
      action: r.recommended_action ?? "",
      effort: r.effort_days,
      priority: r.priority,
      status: r.status,
      notes: r.internal_notes ?? "",
    });

    const mc = dr.getCell("maturity");
    if (MATURITY_BG[r.maturity]) {
      mc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: MATURITY_BG[r.maturity] } };
      mc.font = { bold: true, color: { argb: MATURITY_TEXT[r.maturity] ?? "FF000000" } };
      mc.alignment = { horizontal: "center", vertical: "middle" };
    }

    const sc = dr.getCell("severity");
    if (SEVERITY_BG[r.severity ?? ""]) {
      sc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SEVERITY_BG[r.severity ?? ""] } };
    }

    for (const key of ["requirement", "current_state", "gap", "action", "notes"] as const) {
      dr.getCell(key).alignment = { wrapText: true, vertical: "top" };
    }
  }

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 13 } };
}

function buildRoadmapSheet(wb: ExcelJS.Workbook, rows: GapAssessmentRow[]) {
  const ws = wb.addWorksheet("Roadmap", { views: [{ state: "frozen", ySplit: 1 }] });

  ws.columns = [
    { header: "Priority", key: "priority", width: 10 },
    { header: "Source", key: "source", width: 10 },
    { header: "Article", key: "article", width: 12 },
    { header: "Maturity", key: "maturity", width: 12 },
    { header: "Requirement (excerpt)", key: "requirement", width: 50 },
    { header: "Gap", key: "gap", width: 40 },
    { header: "Action", key: "action", width: 40 },
    { header: "Effort (d)", key: "effort", width: 10 },
    { header: "Status", key: "status", width: 14 },
  ];

  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: WHITE }, size: 11 };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INDIGO } };
  header.alignment = { vertical: "middle" };
  header.height = 24;

  const roadmap = rows
    .filter(
      (r) =>
        (r.status === "open" || r.status === "in_progress") &&
        (r.maturity === "missing" || r.maturity === "partial" || (r.gap_description ?? "").trim().length > 0)
    )
    .sort((a, b) => {
      const ap = a.priority ?? 99;
      const bp = b.priority ?? 99;
      if (ap !== bp) return ap - bp;
      const ae = a.effort_days ?? 999;
      const be = b.effort_days ?? 999;
      return ae - be;
    });

  for (const r of roadmap) {
    const dr = ws.addRow({
      priority: r.priority ? `P${r.priority}` : "—",
      source: SOURCE_LABELS[r.primary_source_id ?? ""] ?? r.primary_source_id,
      article: r.primary_article_ref,
      maturity: MATURITY_LABELS[r.maturity] ?? r.maturity,
      requirement: (r.requirement_text_plain ?? "").slice(0, 240),
      gap: r.gap_description ?? "",
      action: r.recommended_action ?? "",
      effort: r.effort_days,
      status: r.status,
    });

    const pc = dr.getCell("priority");
    if (r.priority === 1) {
      pc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFECDD3" } };
      pc.font = { bold: true, color: { argb: "FF881337" } };
    } else if (r.priority === 2) {
      pc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
      pc.font = { bold: true, color: { argb: "FF7C2D12" } };
    }
    pc.alignment = { horizontal: "center" };

    const mc = dr.getCell("maturity");
    if (MATURITY_BG[r.maturity]) {
      mc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: MATURITY_BG[r.maturity] } };
      mc.font = { color: { argb: MATURITY_TEXT[r.maturity] ?? "FF000000" } };
    }

    for (const key of ["requirement", "gap", "action"] as const) {
      dr.getCell(key).alignment = { wrapText: true, vertical: "top" };
    }
  }

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 9 } };
}
