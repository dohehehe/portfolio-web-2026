import { signOut } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/require-user";
import styles from "../admin.module.css";

export default async function AdminHomePage() {
  const user = await requireUser();

  return (
    <>
      <h1 className={styles.title}>Admin</h1>
      <p className={styles.lead}>로그인된 사용자만 접근할 수 있는 관리 영역입니다.</p>
      <p className={styles.meta}>{user.email}</p>
      <form action={signOut}>
        <button className={styles.buttonSecondary} type="submit">
          Sign out
        </button>
      </form>
    </>
  );
}
