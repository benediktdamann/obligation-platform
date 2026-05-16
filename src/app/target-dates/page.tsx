import { getAllTargetDates, getNextMilestone } from "@/lib/target-dates";
import { TargetDatesView } from "@/components/target-dates/target-dates-view";

export default async function TargetDatesPage() {
  const [dates, next] = await Promise.all([
    getAllTargetDates(),
    getNextMilestone(),
  ]);
  return <TargetDatesView dates={dates} nextMilestone={next} />;
}
