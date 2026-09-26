import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function getSupabaseProxyEnv() {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in server environment"
    );
  }

  return { url, publishableKey };
}

export function copyResponseCookies(from, to) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie.name, cookie.value);
  }
}

/**
 * Refreshes the Supabase auth session and returns the user (if any).
 * @param {import("next/server").NextRequest} request
 */
export async function updateSession(request) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseProxyEnv();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
