import "server-only";

import { fetchTable } from "@/lib/server/data/fetchers/shared";

/** @param {import("@supabase/supabase-js").SupabaseClient} supabase */
export async function fetchWorks(supabase, { limit } = {}) {
  return fetchTable(supabase, "work", {
    order: [
      { column: "order", ascending: true },
      { column: "year", ascending: false },
    ],
    limit,
  });
}
