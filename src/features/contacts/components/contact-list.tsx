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
      <section className="border border-[#E3E2D8] bg-[#F4F4EB] p-10 text-center sm:p-14">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A71D31]">Your network</p>
        <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em]">No contacts yet</h2>
        <p className="mx-auto mt-4 max-w-lg text-[#474744]">
          Add someone you met at Berkeley so you can remember the conversation
          and follow up later.
        </p>
        <button
          className="mt-7 min-h-11 bg-[#A71D31] px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#851526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
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
