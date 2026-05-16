import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { TargetDate } from "./target-date-types";

export type { TargetDate };

export async function getAllTargetDates(): Promise<TargetDate[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("target_dates")
    .select("*")
    .order("target_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TargetDate[];
}

export async function getNextMilestone(): Promise<TargetDate | null> {
  const supabase = await createServerClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("target_dates")
    .select("*")
    .in("status", ["upcoming", "imminent", "in_progress"])
    .gte("target_date", today)
    .order("target_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data as TargetDate | null;
}
