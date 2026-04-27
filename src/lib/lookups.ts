import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import type { LookupEntry, LookupMap, SerializableLookups } from "./lookup-types";

function toRecord(rows: Array<Record<string, unknown>>): LookupMap {
  const entries: [string, LookupEntry][] = [];
  for (const row of rows) {
    const code = (row.code ?? row.key ?? row.id) as string | undefined;
    if (!code) continue;
    entries.push([
      code,
      {
        code,
        label_de: (row.label_de ?? row.name_de ?? code) as string,
        label_en: (row.label_en ?? row.name_en ?? code) as string,
        color: (row.color ?? null) as string | null,
        sort_order: (row.sort_order ?? 0) as number,
      },
    ]);
  }
  return Object.fromEntries(entries);
}

async function fetchLookup(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  table: string
): Promise<LookupMap> {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`[getLookups] Failed to load ${table}:`, error.message);
    return {};
  }
  return toRecord((data ?? []) as Array<Record<string, unknown>>);
}

export async function getLookups(): Promise<SerializableLookups> {
  const supabase = await createServerClient();

  const [entityTypes, addresseeCategories, obligationTypes, severities] =
    await Promise.all([
      fetchLookup(supabase, "lookup_entity_types"),
      fetchLookup(supabase, "lookup_addressee_categories"),
      fetchLookup(supabase, "lookup_obligation_types"),
      fetchLookup(supabase, "lookup_severities"),
    ]);

  return { entityTypes, addresseeCategories, obligationTypes, severities };
}
