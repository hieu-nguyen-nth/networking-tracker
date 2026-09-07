import { ContactCard } from "@/features/contacts/components/contact-card";
import type { Contact } from "@/features/contacts/types/contact";

type ContactListProps = Readonly<{
  contacts: Contact[];
  onAdd: () => void;
  onDelete: (contactId: string) => Promise<void>;
  onEdit: (contact: Contact) => void;
}>;

export function ContactList({
  contacts,
  onAdd,
  onDelete,
  onEdit,
}: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">No contacts yet</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          Add someone you met at Berkeley so you can remember the conversation
          and follow up later.
        </p>
        <button
          className="mt-6 min-h-11 rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          onClick={onAdd}
          type="button"
        >
          Add your first contact
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Your saved contacts">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contacts.map((contact) => (
          <ContactCard
            contact={contact}
            key={contact.id}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
}
