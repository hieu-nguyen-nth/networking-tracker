import type { Contact } from "@/features/contacts/types/contact";

export type ContactPriorityFilter = "all" | Contact["priority"];
export type ContactSort = "newest" | "oldest" | "name" | "company" | "priority";

type ContactViewOptions = Readonly<{
  priority: ContactPriorityFilter;
  query: string;
  sort: ContactSort;
}>;

const priorityRank: Record<Contact["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function searchableText(contact: Contact) {
  return [
    contact.name,
    contact.company,
    contact.role,
    contact.where_met,
    contact.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

export function getVisibleContacts(
  contacts: Contact[],
  { priority, query, sort }: ContactViewOptions,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visible = contacts.filter((contact) => {
    const matchesPriority = priority === "all" || contact.priority === priority;
    const matchesQuery =
      normalizedQuery.length === 0 || searchableText(contact).includes(normalizedQuery);

    return matchesPriority && matchesQuery;
  });

  return visible.toSorted((left, right) => {
    switch (sort) {
      case "oldest":
        return left.created_at.localeCompare(right.created_at);
      case "name":
        return collator.compare(left.name, right.name);
      case "company":
        return collator.compare(left.company ?? "", right.company ?? "");
      case "priority":
        return priorityRank[left.priority] - priorityRank[right.priority];
      case "newest":
      default:
        return right.created_at.localeCompare(left.created_at);
    }
  });
}
