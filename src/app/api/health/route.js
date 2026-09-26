import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      return jsonError("Supabase connection failed", 503, error.message);
    }

    return jsonOk({ supabase: "connected" });
  } catch (err) {
    return jsonError(
      "Supabase is not configured",
      503,
      err instanceof Error ? err.message : String(err)
    );
  }
}
