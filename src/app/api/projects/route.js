import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const includeDrafts = searchParams.get("includeDrafts") === "true";

  let query = supabase
    .from("projects")
    .select("id, user_id, title, slug, description, published, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!includeDrafts) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    return jsonError(error.message, 500);
  }

  return jsonOk({ projects: data ?? [] });
}

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const body = await request.json().catch(() => null);
  const title = body?.title?.trim();
  const slug = body?.slug?.trim();

  if (!title || !slug) {
    return jsonError("title and slug are required");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title,
      slug,
      description: body?.description ?? null,
      published: Boolean(body?.published),
      sort_order: Number(body?.sortOrder ?? 0),
    })
    .select()
    .single();

  if (error) {
    return jsonError(error.message, 400);
  }

  return jsonOk({ project: data }, { status: 201 });
}
