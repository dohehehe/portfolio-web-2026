import { NextResponse } from "next/server";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/auth/constants";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return ADMIN_HOME_PATH;
  }

  if (!value.startsWith("/admin")) {
    return ADMIN_HOME_PATH;
  }

  return value;
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${ADMIN_LOGIN_PATH}?error=auth`);
}
