import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { getTableConfig } from "@/lib/db/tables";
import { readTableRowById } from "@/lib/db/read";

export async function GET(_request, { params }) {
  const { table, id } = await params;

  if (!getTableConfig(table)) {
    return jsonError(`Unknown table: ${table}`, 404);
  }

  const supabase = await createClient();
  const { data, error } = await readTableRowById(supabase, table, id);

  if (error) {
    return jsonError(error.message, 500);
  }
  if (!data) {
    return jsonError("Not found", 404);
  }

  return jsonOk({ table, row: data });
}
