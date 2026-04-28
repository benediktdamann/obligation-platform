import { getLookups } from "@/lib/lookups";
import { getObligations, getStats, getGlobalCount } from "@/lib/obligations";
import { ObligationsBrowser } from "@/components/obligations/obligations-browser";

type SearchParams = Promise<{
  q?: string;
  source?: string;
  severity?: string;
  article?: string;
  obligedEntity?: string;
  internalStakeholder?: string;
  regulatoryAuthority?: string;
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
    obligedEntity: params.obligedEntity,
    internalStakeholder: params.internalStakeholder,
    regulatoryAuthority: params.regulatoryAuthority,
    page: params.page ? Math.max(1, parseInt(params.page)) : 1,
    sortBy: params.sortBy,
    sortDir: (params.sortDir === "desc" ? "desc" : "asc") as "asc" | "desc",
  };

  const [lookups, stats, { obligations, totalCount }, globalCount] =
    await Promise.all([
      getLookups(),
      getStats(filters),
      getObligations(filters),
      getGlobalCount(),
    ]);

  return (
    <ObligationsBrowser
      obligations={obligations}
      totalCount={totalCount}
      stats={stats}
      lookups={lookups}
      currentFilters={filters}
      globalCount={globalCount}
    />
  );
}
