import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { parseLimit } from "@/lib/api/query";
import { getTableConfig } from "@/lib/db/tables";
import { readTableRowByColumn, readTableRows } from "@/lib/db/read";

export async function GET(request, { params }) {
  const { table } = await params;
  const config = getTableConfig(table);

  if (!config) {
    return jsonError(`Unknown table: ${table}`, 404);
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const lookupColumn = searchParams.get("by");
  const lookupValue = searchParams.get("value")?.trim();

  if (lookupColumn && lookupValue) {
    const { data, error } = await readTableRowByColumn(
      supabase,
      table,
      lookupColumn,
      lookupValue
    );
    if (error?.message?.startsWith("Column")) {
      return jsonError(error.message, 400);
    }
    if (error) {
      return jsonError(error.message, 500);
    }
    if (!data) {
      return jsonError("Not found", 404);
    }
    return jsonOk({ table, row: data });
  }

  const limit = parseLimit(
    searchParams,
    config.defaultLimit,
    config.maxLimit
  );
  const result = readTableRows(supabase, table, { limit });

  if (result.error) {
    return jsonError(result.error.message, 400);
  }

  const { data, error } = await result;
  if (error) {
    return jsonError(error.message, 500);
  }

  return jsonOk({ table, rows: data ?? [] });
}
