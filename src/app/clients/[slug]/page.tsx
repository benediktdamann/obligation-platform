import { notFound } from "next/navigation";
import { getEngagementBySlug, getEngagementStats } from "@/lib/clients";
import { ClientDetail } from "@/components/clients/client-detail";

type Params = Promise<{ slug: string }>;

export default async function ClientPage({ params }: { params: Params }) {
  const { slug } = await params;
  const engagement = await getEngagementBySlug(slug);
  if (!engagement) notFound();
  const stats = await getEngagementStats(engagement.id);
  return <ClientDetail engagement={engagement} stats={stats} />;
}
