"use server";

import { redirect } from "next/navigation";
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

export async function signInWithPassword(_prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요." };
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}
