import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, Bell, Search, ArrowRight } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "AML/CFT Compliance",
    description:
      "Manage anti-money laundering and counter-terrorism financing obligations across jurisdictions.",
  },
  {
    icon: FileText,
    title: "Regulatory Reporting",
    description:
      "Streamline regulatory reporting requirements and submission workflows.",
  },
  {
    icon: Bell,
    title: "Obligation Tracking",
    description:
      "Monitor regulatory deadlines and track compliance status in real time.",
  },
  {
    icon: Search,
    title: "Regulatory Intelligence",
    description:
      "Stay current with EU regulatory updates, directives, and technical standards.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex flex-col items-center text-center gap-6">
          <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
            EU Regulatory Framework
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Obligation Platform
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl">
            EU AML/CFT Regulatory Compliance Platform
          </p>

          <Separator className="my-4 max-w-xs" />

          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            A centralized platform for managing anti-money laundering and
            counter-terrorism financing obligations under EU regulatory
            frameworks, including AMLD6, MiCA, and DORA.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <Link href="/obligations">
              Obligations anzeigen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
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
