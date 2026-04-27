"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Obligation } from "@/lib/obligation-types";
import { sourceLabel, formatObligationRef } from "@/lib/obligation-types";
import type { SerializableLookups } from "@/lib/lookup-types";
import { translateCode } from "@/lib/lookup-types";

const SOURCE_CLS: Record<string, string> = {
  AMLR: "border-blue-200 bg-blue-50 text-blue-700",
  AMLD6: "border-purple-200 bg-purple-50 text-purple-700",
  TOFR: "border-orange-200 bg-orange-50 text-orange-700",
};

const SEVERITY_CLS: Record<string, string> = {
  mandatory: "border-red-200 bg-red-50 text-red-700",
  conditional: "border-yellow-200 bg-yellow-50 text-yellow-700",
  recommended: "border-blue-200 bg-blue-50 text-blue-700",
};

type Props = {
  obligation: Obligation | null;
  lookups: SerializableLookups;
  onClose: () => void;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="border-b pb-2 text-sm font-medium text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ObligationDrawer({ obligation, lookups, onClose }: Props) {
  const isOpen = obligation !== null;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !obligation) return null;

  const o = obligation;
  const sourcePrefix = (o.primary_source_id ?? "").split("_")[0].toUpperCase();
  const sourceClass = SOURCE_CLS[sourcePrefix] ?? "";
  const severityClass =
    SEVERITY_CLS[o.severity?.toLowerCase() ?? ""] ?? "bg-muted text-foreground";
  const ref = formatObligationRef(o.primary_article_ref, o.paragraph_ref);
  const formattedDate = o.effective_from
    ? new Date(o.effective_from).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col overflow-hidden bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b px-6 py-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {o.primary_source_id && (
                <Badge className={`border font-mono text-xs ${sourceClass}`}>
                  {sourceLabel(o.primary_source_id)}
                </Badge>
              )}
              <span className="font-mono text-sm text-muted-foreground">
                {ref || "—"}
              </span>
            </div>
            {o.severity && (
              <Badge className={`border text-xs px-2 py-0.5 ${severityClass}`}>
                {translateCode(o.severity, lookups.severities)}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="ml-4 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          {/* Anforderung */}
          <Section title="Anforderung">
            <p className="text-sm leading-relaxed text-foreground">
              {o.requirement_text_plain ?? "—"}
            </p>
          </Section>

          {/* Impact-Area */}
          <Section title="Impact-Area">
            <div className="flex flex-wrap gap-1.5">
              {(o.obligation_types ?? []).length > 0 ? (
                o.obligation_types!.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {translateCode(t, lookups.obligationTypes)}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </Section>

          {/* Verpflichtete */}
          <Section title="Verpflichtete">
            {(o.addressee_categories ?? []).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Adressat-Kategorien
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {o.addressee_categories!.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">
                      {translateCode(c, lookups.addresseeCategories)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {(o.applicable_entity_types ?? []).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Anwendbare Institut-Typen
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {o.applicable_entity_types!.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {translateCode(t, lookups.entityTypes)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {!o.addressee_categories?.length &&
              !o.applicable_entity_types?.length && (
                <span className="text-sm text-muted-foreground">—</span>
              )}
          </Section>

          {/* Wo gilt das */}
          <Section title="Geltungsbereich">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Jurisdiktionen
                </p>
                <p>{o.applies_to_jurisdictions?.join(", ") ?? "EU"}</p>
              </div>
              {formattedDate && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Gültig ab
                  </p>
                  <p>{formattedDate}</p>
                </div>
              )}
            </div>
          </Section>

          {/* Implementation Guidance */}
          {o.implementation_guidance && (
            <Section title="Implementation Guidance">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {o.implementation_guidance}
              </p>
            </Section>
          )}

          {/* Checkliste */}
          {o.checklist_items && o.checklist_items.length > 0 && (
            <Section title="Checkliste">
              <ul className="space-y-2">
                {o.checklist_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 shrink-0 text-muted-foreground">
                      ▸
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </>
  );
}
