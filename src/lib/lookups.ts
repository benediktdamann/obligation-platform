import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { LookupEntry, LookupMap, SerializableLookups } from "./lookup-types";

function toRecord(rows: LookupEntry[]): LookupMap {
  return Object.fromEntries(rows.map((r) => [r.code, r]));
}

export async function getLookups(): Promise<SerializableLookups> {
  const supabase = await createServerClient();

  const [entityTypes, addresseeCategories, obligationTypes, severities] =
    await Promise.all([
      supabase
        .from("lookup_entity_types")
        .select("code,label_de,label_en,color,sort_order")
        .order("sort_order"),
      supabase
        .from("lookup_addressee_categories")
        .select("code,label_de,label_en,color,sort_order")
        .order("sort_order"),
      supabase
        .from("lookup_obligation_types")
        .select("code,label_de,label_en,color,sort_order")
        .order("sort_order"),
      supabase
        .from("lookup_severities")
        .select("code,label_de,label_en,color,sort_order")
        .order("sort_order"),
    ]);

  return {
    entityTypes: toRecord((entityTypes.data ?? []) as LookupEntry[]),
    addresseeCategories: toRecord(
      (addresseeCategories.data ?? []) as LookupEntry[]
    ),
    obligationTypes: toRecord((obligationTypes.data ?? []) as LookupEntry[]),
    severities: toRecord((severities.data ?? []) as LookupEntry[]),
  };
}
