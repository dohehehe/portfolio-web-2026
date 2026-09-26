import { createClient } from "@/lib/supabase/server";
import { jsonOk } from "@/lib/api/http";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return jsonOk({
    user: user ?? null,
    authError: error?.message ?? null,
  });
}
