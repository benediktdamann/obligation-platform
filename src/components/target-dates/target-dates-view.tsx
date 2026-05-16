import Link from "next/link";
import { ChevronLeft, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TargetDate } from "@/lib/target-date-types";
import {
  bucketFor,
  daysUntil,
  CATEGORY_LABELS,
  CATEGORY_CLS,
} from "@/lib/target-date-types";

const BUCKETS = [
  { key: "imminent" as const, title: "Imminent", subtitle: "Within 30 days" },
  { key: "upcoming" as const, title: "Upcoming", subtitle: "Next 6 months" },
  { key: "strategic" as const, title: "Strategic horizon", subtitle: "Beyond 6 months" },
  { key: "completed" as const, title: "In force / completed", subtitle: "Already effective" },
];

type Props = {
  dates: TargetDate[];
  nextMilestone: TargetDate | null;
};

export function TargetDatesView({ dates, nextMilestone }: Props) {
  const now = new Date();
  const grouped: Record<string, TargetDate[]> = {
    imminent: [], upcoming: [], strategic: [], completed: [],
  };
  for (const d of dates) grouped[bucketFor(d, now)].push(d);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-3 w-3" /> Zurück zur Startseite
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight">Regulatory Target Dates</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Jeder Meilenstein, der AML/CFT-Compliance betrifft — AMLR, AMLD6, AMLA, RTS-Konsultationen.
      </p>

      {nextMilestone && <CountdownHero milestone={nextMilestone} />}

      <div className="mt-12 space-y-12">
        {BUCKETS.map(({ key, title, subtitle }) => {
          const items = grouped[key];
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <div className="mb-4 flex items-baseline justify-between border-b pb-2">
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {items.map((d) => <TargetDateCard key={d.id} date={d} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CountdownHero({ milestone }: { milestone: TargetDate }) {
  const days = daysUntil(milestone.target_date);
  const date = new Date(milestone.target_date).toLocaleDateString("de-DE", {
    day: "2-digit", month: "long", year: "numeric",
  });
  return (
    <div className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-blue-50 via-white to-white p-8 dark:from-blue-950/20 dark:via-background dark:to-background">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
          Next milestone
        </span>
        <Badge variant="secondary" className="text-xs">
          {CATEGORY_LABELS[milestone.category] ?? milestone.category}
        </Badge>
      </div>
      <h2 className="text-xl font-semibold mb-2">{milestone.title}</h2>
      {milestone.description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{milestone.description}</p>
      )}
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-bold tabular-nums tracking-tight">{days}</span>
        <span className="text-lg text-muted-foreground">
          {days === 1 ? "day" : "days"} until {date}
        </span>
      </div>
    </div>
  );
}

function TargetDateCard({ date }: { date: TargetDate }) {
  const days = daysUntil(date.target_date);
  const formatted = new Date(date.target_date).toLocaleDateString("de-DE", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const isPast = days < 0;
  const categoryClass = CATEGORY_CLS[date.category] ?? "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={`border text-xs ${categoryClass}`}>
            {CATEGORY_LABELS[date.category] ?? date.category}
          </Badge>
          <div className="text-right">
            <div className="text-sm font-mono">{formatted}</div>
            <div className="text-xs text-muted-foreground tabular-nums">
              {isPast ? `vor ${Math.abs(days)}d` : `in ${days}d`}
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-base mt-2 leading-snug">{date.title}</h3>
      </CardHeader>
      <CardContent className="pt-0">
        {date.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{date.description}</p>
        )}
        {date.affected_entities && date.affected_entities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {date.affected_entities.map((e) => (
              <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
            ))}
          </div>
        )}
        {date.notes && (
          <p className="text-xs text-muted-foreground italic mt-3 pt-3 border-t">{date.notes}</p>
        )}
        {date.external_url && (
          <a
            href={date.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Quelle <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
