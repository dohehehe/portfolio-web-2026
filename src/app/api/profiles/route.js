import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  let query = supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, bio, created_at, updated_at");

  if (username) {
    query = query.eq("username", username).maybeSingle();
  } else {
    query = query.limit(50);
  }

  const { data, error } = await query;

  if (error) {
    return jsonError(error.message, 500);
  }

  return jsonOk({ profiles: username ? (data ? [data] : []) : (data ?? []) });
}
