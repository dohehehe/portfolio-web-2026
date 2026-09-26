import "server-only";

import { fetchTable } from "@/lib/server/data/fetchers/shared";

/** @param {import("@supabase/supabase-js").SupabaseClient} supabase */
export async function fetchTexts(supabase, { limit } = {}) {
  const [texts, textTypes] = await Promise.all([
    fetchTable(supabase, "text", {
      order: [
        { column: "year", ascending: false },
        { column: "created_at", ascending: false },
      ],
      limit,
    }),
    fetchTable(supabase, "text_type", {
      activeOnly: false,
      order: [{ column: "name", ascending: true }],
    }),
  ]);

  const typesById = Object.fromEntries(textTypes.map((row) => [row.id, row]));

  return {
    texts,
    textTypes,
    textsWithType: texts.map((row) => ({
      ...row,
      type: typesById[row.type_id] ?? null,
    })),
  };
}
