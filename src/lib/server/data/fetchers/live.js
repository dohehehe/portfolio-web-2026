import "server-only";

import { fetchTable } from "@/lib/server/data/fetchers/shared";

/** @param {import("@supabase/supabase-js").SupabaseClient} supabase */
export async function fetchLiveEntries(supabase, { limit } = {}) {
  return fetchTable(supabase, "live", {
    activeOnly: false,
    order: [{ column: "created_at", ascending: false }],
    limit,
  });
}
