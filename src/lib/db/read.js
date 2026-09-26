import "server-only";

import { getTableConfig } from "@/lib/db/tables";

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} table
 * @param {{ limit?: number; skipDefaultFilters?: boolean }} [options]
 */
export function readTableRows(supabase, table, options = {}) {
  const config = getTableConfig(table);
  if (!config) {
    return { error: { message: `Unknown table: ${table}` } };
  }

  const limit = Math.min(
    options.limit ?? config.defaultLimit,
    config.maxLimit
  );

  let query = supabase.from(table).select(config.select).limit(limit);

  if (config.order) {
    for (const { column, ascending } of config.order) {
      query = query.order(column, { ascending });
    }
  }

  if (config.defaultFilters && !options.skipDefaultFilters) {
    for (const filter of config.defaultFilters) {
      if (filter.op === "eq") {
        query = query.eq(filter.column, filter.value);
      }
    }
  }

  return query;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} table
 * @param {string} id
 */
export function readTableRowById(supabase, table, id) {
  const config = getTableConfig(table);
  if (!config) {
    return { error: { message: `Unknown table: ${table}` } };
  }

  return supabase.from(table).select(config.select).eq("id", id).maybeSingle();
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} table
 * @param {string} column
 * @param {string} value
 */
export function readTableRowByColumn(supabase, table, column, value) {
  const config = getTableConfig(table);
  if (!config) {
    return { error: { message: `Unknown table: ${table}` } };
  }

  if (config.select !== "*" && !config.select.includes(column)) {
    return { error: { message: `Column not readable: ${column}` } };
  }

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(column)) {
    return { error: { message: `Invalid column name: ${column}` } };
  }

  return supabase
    .from(table)
    .select(config.select)
    .eq(column, value)
    .maybeSingle();
}
