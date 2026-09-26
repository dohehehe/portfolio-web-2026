import "server-only";

import { fetchTable } from "@/lib/server/data/fetchers/shared";

/** @param {import("@supabase/supabase-js").SupabaseClient} supabase */
export async function fetchCvBundle(supabase) {
  const [cvRows, cvTypes, linkItems] = await Promise.all([
    fetchTable(supabase, "cv", {
      order: [
        { column: "year", ascending: false },
        { column: "created_at", ascending: false },
      ],
    }),
    fetchTable(supabase, "cv_type", {
      activeOnly: false,
      order: [{ column: "name_ko", ascending: true }],
    }),
    fetchTable(supabase, "link_cv_item", {
      activeOnly: false,
      order: [{ column: "created_at", ascending: true }],
    }),
  ]);

  const typesById = Object.fromEntries(cvTypes.map((row) => [row.id, row]));

  return {
    cv: cvRows.map((row) => ({
      ...row,
      type: typesById[row.type_id] ?? null,
    })),
    cvTypes,
    linkCvItems: linkItems,
  };
}
