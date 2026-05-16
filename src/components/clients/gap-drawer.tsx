"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { GapAssessmentRow } from "@/lib/assessment-types";
import {
  MATURITY_OPTIONS,
  MATURITY_CHIP,
  STATUS_OPTIONS,
  SOURCE_LABELS,
} from "@/lib/assessment-types";

type Props = {
  row: GapAssessmentRow;
  onClose: () => void;
  onSave: (updates: Partial<GapAssessmentRow>) => void;
};

export function GapDrawer({ row, onClose, onSave }: Props) {
  const [maturity, setMaturity] = useState(row.maturity);
  const [currentState, setCurrentState] = useState(row.current_state ?? "");
  const [gapDescription, setGapDescription] = useState(row.gap_description ?? "");
  const [recommendedAction, setRecommendedAction] = useState(row.recommended_action ?? "");
  const [effortDays, setEffortDays] = useState(row.effort_days?.toString() ?? "");
  const [priority, setPriority] = useState(row.priority?.toString() ?? "");
  const [status, setStatus] = useState(row.status);
  const [internalNotes, setInternalNotes] = useState(row.internal_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const updates = {
      maturity,
      current_state: currentState || null,
      gap_description: gapDescription || null,
      recommended_action: recommendedAction || null,
      effort_days: effortDays ? Number(effortDays) : null,
      priority: priority ? Number(priority) : null,
      status,
      internal_notes: internalNotes || null,
    };
    const supabase = createClient();
    const { error } = await supabase.from("gap_assessments").update(updates).eq("id", row.gap_id);
    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      onSave(updates as Partial<GapAssessmentRow>);
    }
  }

  const inputCls =
    "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto border-l border-slate-800 bg-slate-900 sm:w-[640px]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-3">
          <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
            {SOURCE_LABELS[row.primary_source_id ?? ""] ?? row.primary_source_id} {row.primary_article_ref}
            {row.paragraph_ref && row.paragraph_ref !== row.primary_article_ref ? ` ${row.paragraph_ref}` : ""}
          </span>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pflicht-Text</div>
            <p className="rounded-md border border-slate-800 bg-slate-950 p-3 text-sm leading-relaxed text-slate-200">
              {row.requirement_text_plain}
            </p>
          </div>

          {row.implementation_guidance && (
            <div>
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Implementation Guidance
              </div>
              <p className="rounded-md border border-slate-800 bg-slate-950 p-3 text-sm leading-relaxed text-slate-300">
                {row.implementation_guidance}
              </p>
            </div>
          )}

          {row.checklist_items && row.checklist_items.length > 0 && (
            <div>
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Checklist</div>
              <ul className="space-y-1 rounded-md border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                {row.checklist_items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 text-slate-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Maturity</div>
            <div className="flex flex-wrap gap-1.5">
              {MATURITY_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMaturity(m.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    maturity === m.value
                      ? MATURITY_CHIP[m.value]
                      : "border border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Aktueller Stand beim Kunden
            </label>
            <textarea
              value={currentState}
              onChange={(e) => setCurrentState(e.target.value)}
              rows={2}
              className={inputCls}
              placeholder="Was hat der Kunde aktuell zu dieser Pflicht?"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Gap-Beschreibung
            </label>
            <textarea
              value={gapDescription}
              onChange={(e) => setGapDescription(e.target.value)}
              rows={2}
              className={inputCls}
              placeholder="Was fehlt konkret?"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Empfohlene Maßnahme
            </label>
            <textarea
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              rows={3}
              className={inputCls}
              placeholder="Welche Maßnahme schließt die Lücke?"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Effort (Tage)
              </label>
              <input
                type="number"
                step="0.5"
                value={effortDays}
                onChange={(e) => setEffortDays(e.target.value)}
                className={inputCls}
                placeholder="2.5"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Priorität (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputCls}
                placeholder="3"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Status
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Interne Notizen
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={2}
              className={inputCls}
              placeholder="Optional"
            />
          </div>

          {error && (
            <div className="rounded-md border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Abbrechen
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Speichern
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
