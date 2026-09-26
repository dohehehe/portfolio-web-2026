import { signOut } from "@/lib/auth/actions";
import AdminDataTables from "./AdminDataTables";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard({ user }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin</h1>
          {user?.email ? <p className={styles.email}>{user.email}</p> : null}
        </div>
        <form action={signOut}>
          <button className={styles.logoutButton} type="submit">
            로그아웃
          </button>
        </form>
      </div>

      <p className={styles.content}>
        포트폴리오 콘텐츠를 관리할 수 있는 관리자 페이지입니다.
      </p>

      <AdminDataTables />
    </div>
  );
}
