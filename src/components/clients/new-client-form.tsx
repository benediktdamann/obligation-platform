"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function slugify(name: string) {
  return name.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 60);
}

export function NewClientForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const name = fd.get("customer_name") as string;
    const slug = slugify(name);

    const payload = {
      customer_name: name,
      customer_slug: slug,
      customer_industry: fd.get("customer_industry") as string,
      customer_size: fd.get("customer_size") as string,
      customer_country: (fd.get("customer_country") as string) || "DE",
      primary_contact_name: (fd.get("primary_contact_name") as string) || null,
      primary_contact_role: (fd.get("primary_contact_role") as string) || null,
      primary_contact_email: (fd.get("primary_contact_email") as string) || null,
      engagement_type: fd.get("engagement_type") as string,
      status: (fd.get("status") as string) || "active",
      start_date: (fd.get("start_date") as string) || null,
      target_completion_date: (fd.get("target_completion_date") as string) || null,
      fixed_price_eur: fd.get("fixed_price_eur") ? Number(fd.get("fixed_price_eur")) : null,
      internal_notes: (fd.get("internal_notes") as string) || null,
    };

    const supabase = createClient();
    const { error } = await supabase.from("sprint_engagements").insert(payload);
    if (error) setError(error.message);
    else startTransition(() => router.push(`/clients/${slug}`));
  }

  const inputCls = "h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Section title="Kunde">
        <Field label="Firmenname" required>
          <input name="customer_name" required className={inputCls} placeholder="Demo Fintech AG" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Industrie">
            <select name="customer_industry" defaultValue="payment-services" className={inputCls}>
              <option value="payment-services">Payment Services</option>
              <option value="e-money">E-Money Institution</option>
              <option value="neo-bank">Neo-Bank</option>
              <option value="casp">CASP / Crypto</option>
              <option value="kvg">KVG / Investment</option>
              <option value="credit-institution">Credit Institution</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Größe (FTE)">
            <select name="customer_size" defaultValue="50-200" className={inputCls}>
              <option value="<50">&lt; 50 FTE</option>
              <option value="50-200">50–200 FTE</option>
              <option value="200-500">200–500 FTE</option>
              <option value="500+">500+ FTE</option>
            </select>
          </Field>
        </div>
        <Field label="Land">
          <input name="customer_country" defaultValue="DE" maxLength={2} className={inputCls} />
        </Field>
      </Section>

      <Section title="Hauptkontakt">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><input name="primary_contact_name" className={inputCls} /></Field>
          <Field label="Rolle"><input name="primary_contact_role" className={inputCls} placeholder="MLRO / Head of Compliance" /></Field>
        </div>
        <Field label="E-Mail"><input name="primary_contact_email" type="email" className={inputCls} /></Field>
      </Section>

      <Section title="Engagement">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Typ">
            <select name="engagement_type" defaultValue="amlr_sprint" className={inputCls}>
              <option value="amlr_sprint">AMLR Readiness Sprint</option>
              <option value="amla_response">AMLA Data Response</option>
              <option value="dora_assessment">DORA Assessment</option>
              <option value="retainer">Retainer</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Status">
            <select name="status" defaultValue="active" className={inputCls}>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start"><input name="start_date" type="date" className={inputCls} /></Field>
          <Field label="Ziel-Abschluss"><input name="target_completion_date" type="date" className={inputCls} /></Field>
        </div>
        <Field label="Festpreis (EUR)">
          <input name="fixed_price_eur" type="number" step="100" defaultValue="19500" className={inputCls} />
        </Field>
      </Section>

      <Section title="Notizen">
        <textarea name="internal_notes" rows={3} className={`${inputCls} h-auto resize-none py-2`} placeholder="Interne Notizen, Sales-Kontext, etc." />
      </Section>

      {error && <div className="rounded-md border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">{error}</div>}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50">
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Mandat anlegen
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-400">
        {label} {required && <span className="text-rose-400">*</span>}
      </div>
      {children}
    </label>
  );
}
