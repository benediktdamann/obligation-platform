import { NewClientForm } from "@/components/clients/new-client-form";
import { SiteNav } from "@/components/site-nav";

export default function NewClientPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Neues Mandat</h1>
          <p className="mt-1 text-sm text-slate-400">
            Beim Speichern werden alle 2.144 Obligations automatisch als „not assessed" initialisiert.
          </p>
        </div>
        <NewClientForm />
      </main>
    </div>
  );
}
