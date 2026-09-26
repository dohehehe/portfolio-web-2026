import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { getReadableTableNames, getRemoteTablesMeta } from "@/lib/db/tables";
export async function GET() {
  try {
    const supabase = await createClient();
    const meta = getRemoteTablesMeta();
    const tables = getReadableTableNames();
    const firstTable = tables[0];

    if (!firstTable) {
      return jsonOk({
        supabase: "connected",
        tables: [],
        syncedAt: meta.syncedAt,
        hint: "Run npm run db:tables to sync table names from remote",
      });
    }

    const { error } = await supabase.from(firstTable).select("*").limit(1);

    if (error) {
      return jsonError("Supabase connection failed", 503, error.message);
    }

    return jsonOk({
      supabase: "connected",
      tables,
      syncedAt: meta.syncedAt,
    });
  } catch (err) {
    return jsonError(
      "Supabase is not configured",
      503,
      err instanceof Error ? err.message : String(err)
    );
  }
}
