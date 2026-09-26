import { redirect } from "next/navigation";
import { ADMIN_HOME_PATH } from "@/lib/auth/constants";
import { getUser } from "@/lib/auth/session";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

function safeNextPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return ADMIN_HOME_PATH;
  }

  if (!value.startsWith("/admin") || value.startsWith("/admin/login")) {
    return ADMIN_HOME_PATH;
  }

  return value;
}

export default async function AdminLoginPage({ searchParams }) {
  const user = await getUser();

  if (user) {
    redirect(ADMIN_HOME_PATH);
  }

  const params = await searchParams;
  const nextPath = safeNextPath(params?.next);
  const authError = params?.error === "auth";

  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>Admin</h1>
      <p className={styles.lead}>Supabase 계정으로 로그인하세요.</p>
      {authError ? (
        <p className={styles.error}>인증 링크가 만료되었거나 유효하지 않습니다.</p>
      ) : null}
      <LoginForm nextPath={nextPath} />
    </div>
  );
}
