import AdminDashboard from "@/components/admin/AdminDashboard";
import { requireUser } from "@/lib/auth/require-user";

export default async function AdminHomePage() {
  const user = await requireUser();

  return <AdminDashboard user={user} />;
}
