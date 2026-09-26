import { createClient } from "@supabase/supabase-js";
import { getServiceRoleEnv } from "./env";

/**
 * Service-role client for trusted server jobs only (never expose to the browser).
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = getServiceRoleEnv();
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
