import { requireUser } from "@/lib/auth/require-user";

export default async function AdminProtectedLayout({ children }) {
  await requireUser();
  return children;
}
