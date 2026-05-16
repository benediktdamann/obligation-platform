"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/clients", label: "Mandate" },
  { href: "/obligations", label: "Obligations" },
  { href: "/target-dates", label: "Target Dates" },
  { href: "/news", label: "News" },
  { href: "/sources", label: "Sources" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600">
            <span className="text-xs font-bold text-white">O</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-50">Obligation</span>
        </Link>
        <nav className="flex items-center gap-0.5">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
