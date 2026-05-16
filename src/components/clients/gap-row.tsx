"use client";

import { createClient } from "@/lib/supabase/client";
import type { GapAssessmentRow } from "@/lib/assessment-types";
import { MATURITY_DOTS, SEVERITY_CHIP, SEVERITY_LABELS, SOURCE_LABELS } from "@/lib/assessment-types";

type Props = {
  row: GapAssessmentRow;
  onClick: () => void;
  onMaturityChange: (maturity: string) => void;
};

const QUICK_BUTTONS = [
  { value: "missing", label: "M", title: "Missing", active: "bg-rose-500/20 text-rose-300" },
  { value: "partial", label: "P", title: "Partial", active: "bg-amber-500/20 text-amber-300" },
  { value: "adequate", label: "A", title: "Adequate", active: "bg-blue-500/20 text-blue-300" },
  { value: "strong", label: "S", title: "Strong", active: "bg-emerald-500/20 text-emerald-300" },
];

export function GapRow({ row, onClick, onMaturityChange }: Props) {
  async function quickSet(maturity: string, e: React.MouseEvent) {
    e.stopPropagation();
    onMaturityChange(maturity);
    const supabase = createClient();
    await supabase.from("gap_assessments").update({ maturity }).eq("id", row.gap_id);
  }

  const dotCls = MATURITY_DOTS[row.maturity] ?? "bg-slate-500";
  const severityCls = SEVERITY_CHIP[row.severity ?? ""] ?? "";
  const sourceLabel = SOURCE_LABELS[row.primary_source_id ?? ""] ?? row.primary_source_id;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900 p-3 transition-colors hover:border-slate-700"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotCls}`} />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              {sourceLabel} {row.primary_article_ref}
              {row.paragraph_ref && row.paragraph_ref !== row.primary_article_ref ? ` ${row.paragraph_ref}` : ""}
            </span>
            {row.severity && (
              <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${severityCls}`}>
                {SEVERITY_LABELS[row.severity] ?? row.severity}
              </span>
            )}
            {row.priority != null && (
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                P{row.priority}
              </span>
            )}
            {row.effort_days != null && (
              <span className="text-[10px] tabular-nums text-slate-500">{row.effort_days}d</span>
            )}
          </div>

          <p className="line-clamp-2 text-sm leading-snug text-slate-200">
            {row.requirement_text_plain}
          </p>

          {row.gap_description && (
            <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-rose-300">
              <span className="font-semibold">Gap: </span>
              {row.gap_description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          {QUICK_BUTTONS.map((btn) => {
            const isActive = row.maturity === btn.value;
            return (
              <button
                key={btn.value}
                onClick={(e) => quickSet(btn.value, e)}
                title={btn.title}
                className={`h-6 w-6 rounded text-[10px] font-bold transition-colors ${
                  isActive ? btn.active : "text-slate-600 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
