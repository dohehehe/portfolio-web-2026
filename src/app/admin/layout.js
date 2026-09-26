import styles from "./admin.module.css";

export const metadata = {
  title: "Admin · dohee kwak",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className={styles.adminLayout}>{children}</div>;
}
