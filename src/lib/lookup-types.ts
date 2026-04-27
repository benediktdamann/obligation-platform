export type LookupEntry = {
  code: string;
  label_de: string;
  label_en: string;
  color: string | null;
  sort_order: number;
};

// Record<code, LookupEntry> — O(1) lookup, serializable for Server→Client prop passing
export type LookupMap = Record<string, LookupEntry>;

export type SerializableLookups = {
  entityTypes: LookupMap;
  addresseeCategories: LookupMap;
  obligationTypes: LookupMap;
  severities: LookupMap;
};

export function translateCode(code: string, lookup: LookupMap): string {
  return lookup[code]?.label_de ?? code;
}
