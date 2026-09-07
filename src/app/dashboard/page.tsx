import { ContactDashboard } from "@/features/contacts/components/contact-dashboard";
import { RequireAuth } from "@/features/auth/components/require-auth";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <ContactDashboard />
    </RequireAuth>
  );
}
