import Link from "next/link";
import { ArrowRight, Calendar, FileText, Newspaper, Database } from "lucide-react";
import { SiteNav } from "@/components/site-nav";

const features = [
  {
    href: "/target-dates",
    icon: Calendar,
    title: "Target Dates",
    description: "Every regulatory milestone in one timeline — countdown to next critical deadline.",
    accentBg: "bg-rose-50 dark:bg-rose-950/30",
    accentText: "text-rose-600 dark:text-rose-400",
  },
  {
    href: "/obligations",
    icon: FileText,
    title: "Obligations",
    description: "Searchable, filterable register of every duty under AMLR, AMLD6, and ToFR.",
    accentBg: "bg-indigo-50 dark:bg-indigo-950/30",
    accentText: "text-indigo-600 dark:text-indigo-400",
  },
  {
    href: "/news",
    icon: Newspaper,
    title: "Intelligence",
    description: "Daily updates from AMLA, EBA, BaFin, FATF with auto-linked obligations.",
    accentBg: "bg-violet-50 dark:bg-violet-950/30",
    accentText: "text-violet-600 dark:text-violet-400",
  },
  {
    href: "/sources",
    icon: Database,
    title: "Sources",
    description: "Complete source registry with crawler status and update frequency.",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
    accentText: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AMLR enters force in{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">July 2027</span>
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
            Obligation Platform
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Centralized view of every AML/CFT obligation, target date, and regulatory update — built for compliance teams preparing for AMLR direct supervision.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href} className="group">
                <div className="h-full rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${feature.accentBg}`}>
                      <Icon className={`h-5 w-5 ${feature.accentText}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{feature.title}</h3>
                        <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
