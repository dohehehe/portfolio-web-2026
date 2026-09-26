import "server-only";

import { fetchTable } from "@/lib/server/data/fetchers/shared";

/** @param {import("@supabase/supabase-js").SupabaseClient} supabase */
export async function fetchEvents(supabase, { limit } = {}) {
  return fetchTable(supabase, "event", {
    order: [
      { column: "date", ascending: false },
      { column: "created_at", ascending: false },
    ],
    limit,
  });
}
