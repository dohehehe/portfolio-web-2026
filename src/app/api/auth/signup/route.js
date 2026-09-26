import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return jsonError("email and password are required");
  }

  if (password.length < 8) {
    return jsonError("password must be at least 8 characters");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: body?.fullName ?? null,
      },
    },
  });

  if (error) {
    return jsonError(error.message, 400);
  }

  return jsonOk(
    {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: !data.session,
    },
    { status: 201 }
  );
}
