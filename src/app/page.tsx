import Link from "next/link";
import { ArrowUpRight, Calendar, FileText, Newspaper, Database } from "lucide-react";
import { SiteNav } from "@/components/site-nav";

const tiles = [
  {
    href: "/target-dates",
    icon: Calendar,
    title: "Target Dates",
    description: "Regulatory milestones & countdowns",
    accent: "text-rose-400",
    accentBg: "bg-rose-500/10",
  },
  {
    href: "/obligations",
    icon: FileText,
    title: "Obligations",
    description: "Searchable register of duties",
    accent: "text-indigo-400",
    accentBg: "bg-indigo-500/10",
  },
  {
    href: "/news",
    icon: Newspaper,
    title: "News",
    description: "Daily updates, auto-linked",
    accent: "text-violet-400",
    accentBg: "bg-violet-500/10",
  },
  {
    href: "/sources",
    icon: Database,
    title: "Sources",
    description: "Registry & crawler status",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AMLR enters force in <span className="font-semibold text-slate-200">July 2027</span>
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl">
            Obligation Platform
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-400">
            Centralized view of every AML/CFT obligation, target date, and regulatory update — built for compliance teams preparing for AMLR direct supervision.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link key={tile.title} href={tile.href} className="group">
                <div className="h-full rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/80">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tile.accentBg}`}>
                      <Icon className={`h-5 w-5 ${tile.accent}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-semibold text-slate-50">{tile.title}</h3>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-300" />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{tile.description}</p>
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
