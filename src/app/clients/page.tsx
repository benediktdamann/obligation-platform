import { getAllEngagements } from "@/lib/clients";
import { ClientsList } from "@/components/clients/clients-list";

export default async function ClientsPage() {
  const engagements = await getAllEngagements();
  return <ClientsList engagements={engagements} />;
}
