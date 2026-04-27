import { getLookups } from "@/lib/lookups";
import { getObligations, getStats } from "@/lib/obligations";
import { ObligationsBrowser } from "@/components/obligations/obligations-browser";

type SearchParams = Promise<{
  q?: string;
  source?: string;
  severity?: string;
  article?: string;
  addressee?: string;
  page?: string;
  sortBy?: string;
  sortDir?: string;
}>;

export default async function ObligationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const filters = {
    q: params.q,
    source: params.source,
    severity: params.severity,
    article: params.article,
    addressee: params.addressee,
    page: params.page ? Math.max(1, parseInt(params.page)) : 1,
    sortBy: params.sortBy,
    sortDir: (params.sortDir === "desc" ? "desc" : "asc") as "asc" | "desc",
  };

  const [lookups, stats, { obligations, totalCount }] = await Promise.all([
    getLookups(),
    getStats(),
    getObligations(filters),
  ]);

  const addresseeOptions = Object.values(lookups.addresseeCategories)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(({ code, label_de }) => ({ code, label_de }));

  return (
    <ObligationsBrowser
      obligations={obligations}
      totalCount={totalCount}
      stats={stats}
      lookups={lookups}
      currentFilters={filters}
      addresseeOptions={addresseeOptions}
    />
  );
}
