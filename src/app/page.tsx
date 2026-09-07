import { AppShell } from "@/components/ui/app-shell";
import { ContactsOverview } from "@/features/contacts/components/contacts-overview";

export default function Home() {
  return (
    <AppShell>
      <ContactsOverview />
    </AppShell>
  );
}
