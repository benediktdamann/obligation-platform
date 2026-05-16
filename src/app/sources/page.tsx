import { getAllSources } from "@/lib/sources";
import { SourcesView } from "@/components/sources/sources-view";

export default async function SourcesPage() {
  const sources = await getAllSources();
  return <SourcesView sources={sources} />;
}
