import "server-only";

import { fetchTable } from "@/lib/server/data/fetchers/shared";

/** @param {import("@supabase/supabase-js").SupabaseClient} supabase */
export async function fetchProjects(supabase, { limit } = {}) {
  return fetchTable(supabase, "project", {
    order: [
      { column: "year", ascending: false },
      { column: "created_at", ascending: false },
    ],
    limit,
  });
}
