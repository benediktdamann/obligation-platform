import { createServerClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Obligation = {
  primary_source_id: string | null;
  primary_article_ref: string | null;
  paragraph_ref: string | null;
  requirement_text_plain: string | null;
  severity: string | null;
  obligation_types: string[] | string | null;
};

function SeverityBadge({ severity }: { severity: string | null }) {
  if (!severity) return <span className="text-muted-foreground">—</span>;

  const lower = severity.toLowerCase();

  if (lower === "mandatory") {
    return <Badge variant="destructive">Mandatory</Badge>;
  }
  if (lower === "conditional") {
    return (
      <Badge className="border border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Conditional
      </Badge>
    );
  }
  if (lower === "recommended") {
    return (
      <Badge className="border border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
        Recommended
      </Badge>
    );
  }

  return <Badge variant="secondary">{severity}</Badge>;
}

function truncate(text: string | null, max: number): string {
  if (!text) return "—";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function formatTypes(types: string[] | string | null): string {
  if (!types) return "—";
  if (Array.isArray(types)) return types.join(", ") || "—";
  return types;
}

export default async function ObligationsPage() {
  const supabase = await createServerClient();

  const { data: obligations, error } = await supabase
    .from("obligations")
    .select(
      "primary_source_id, primary_article_ref, paragraph_ref, requirement_text_plain, severity, obligation_types"
    )
    .limit(50);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>Obligations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Obligations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Regulatory obligations — max. 50 Einträge
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Fehler beim Laden: {error.message}
        </div>
      )}

      {!error && obligations?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Keine Obligations gefunden.
        </p>
      )}

      {!error && obligations && obligations.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Paragraph</TableHead>
                <TableHead className="min-w-[320px]">Requirement</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Types</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(obligations as Obligation[]).map((o, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                    {o.primary_source_id ?? "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {o.primary_article_ref ?? "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {o.paragraph_ref ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {truncate(o.requirement_text_plain, 200)}
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={o.severity} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatTypes(o.obligation_types)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
