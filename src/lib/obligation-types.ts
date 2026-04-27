// Client-safe: no server imports. Used by both Server Components and Client Components.

export type Obligation = {
  id: string;
  primary_source_id: string | null;
  primary_article_ref: string | null;
  paragraph_ref: string | null;
  requirement_text_plain: string | null;
  severity: string | null;
  obligation_types: string[] | null;
  addressee_categories: string[] | null;
  applicable_entity_types: string[] | null;
  jurisdiction: string | null;
  effective_from: string | null;
  implementation_guidance: string | null;
  checklist_items: string[] | null;
};

export type ObligationsFilters = {
  q?: string;
  source?: string;
  severity?: string;
  article?: string;
  addressee?: string;
  page?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export const PAGE_SIZE = 50;
