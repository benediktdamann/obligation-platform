import { getNews } from "@/lib/news";
import { NewsBrowser } from "@/components/news/news-browser";

type SearchParams = Promise<{ q?: string; authority?: string; page?: string }>;

export default async function NewsPage({
  searchParams,
}: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = {
    q: params.q,
    authority: params.authority,
    page: params.page ? Math.max(1, parseInt(params.page)) : 1,
  };
  const { items, totalCount } = await getNews(filters);
  return (
    <NewsBrowser items={items} totalCount={totalCount} currentFilters={filters} />
  );
}
