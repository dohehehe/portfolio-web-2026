import "server-only";

const ACTIVE_COLUMN_TABLES = new Set([
  "cv",
  "event",
  "project",
  "text",
  "work",
]);

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} table
 * @param {{
 *   select?: string;
 *   order?: { column: string; ascending?: boolean }[];
 *   limit?: number;
 *   activeOnly?: boolean;
 * }} [options]
 */
export async function fetchTable(supabase, table, options = {}) {
  const {
    select = "*",
    order = [{ column: "created_at", ascending: false }],
    limit,
    activeOnly = ACTIVE_COLUMN_TABLES.has(table),
  } = options;

  let query = supabase.from(table).select(select);

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  for (const { column, ascending = true } of order) {
    query = query.order(column, { ascending });
  }

  if (limit != null) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return data ?? [];
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 */
export async function fetchInfo(supabase) {
  const rows = await fetchTable(supabase, "info", {
    activeOnly: false,
    limit: 1,
  });
  return rows[0] ?? null;
}
