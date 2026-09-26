import "server-only";

import { headers } from "next/headers";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { LOCALE_HEADER } from "@/lib/locale/routing";

/** @returns {Promise<"ko" | "en">} */
export async function getServerLocale() {
  const headerStore = await headers();
  const locale = headerStore.get(LOCALE_HEADER);
  return locale === "en" ? "en" : DEFAULT_LOCALE;
}
