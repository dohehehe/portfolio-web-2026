import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getDataClient() {
  return createClient();
}
