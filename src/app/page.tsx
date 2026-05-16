import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Calendar, FileText, Newspaper, Database } from "lucide-react";

const features = [
  {
    href: "/target-dates",
    icon: Calendar,
    title: "Target Dates",
    description: "Jeder regulatorische Meilenstein in einer Übersicht — Countdown zur nächsten Frist.",
  },
  {
    href: "/obligations",
    icon: FileText,
    title: "Obligations",
    description: "Alle Pflichten aus AMLR, AMLD6 und ToFR — durchsuchbar, filterbar, annotierbar.",
  },
  {
    href: "/news",
    icon: Newspaper,
    title: "Regulatory Intelligence",
    description: "Tägliche Updates von AMLA, EBA, BaFin und FATF mit Link zu betroffenen Pflichten.",
  },
  {
    href: "/sources",
    icon: Database,
    title: "Sources",
    description: "Vollständige Quellenliste mit Crawler-Status und Aktualisierungs-Frequenz.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex flex-col items-center text-center gap-6">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
            EU Regulatory Framework · AMLR 2027
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Obligation Platform
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            EU AML/CFT Regulatory Compliance Platform
          </p>
          <Separator className="my-4 max-w-xs" />
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Zentralisierte Plattform für Pflichten unter AMLR, AMLD6, ToFR und verwandten
            EU-Rahmenwerken. Gebaut für Compliance-Teams, die sich auf den 10. Juli 2027
            vorbereiten.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href} className="group">
                <Card className="border border-border transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Built for compliance teams operating under EU AML/CFT regulations
          </p>
        </div>
      </main>
    </div>
  );
}
