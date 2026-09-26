import "server-only";

import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/auth/constants";
import { getUser } from "@/lib/auth/session";

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return user;
}
