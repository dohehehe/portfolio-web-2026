import "server-only";

/**
 * Supabase credentials used only on the server (never NEXT_PUBLIC_*).
 * @returns {{ url: string; publishableKey: string }}
 */
export function getSupabaseServerEnv() {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in server environment"
    );
  }

  return { url, publishableKey };
}
