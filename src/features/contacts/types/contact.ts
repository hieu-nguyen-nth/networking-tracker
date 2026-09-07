import type { Database } from "@/lib/neon/database.types";

type ContactsTable = Database["public"]["Tables"]["contacts"];

export type Contact = ContactsTable["Row"];
export type ContactInsert = ContactsTable["Insert"];
export type ContactUpdate = ContactsTable["Update"];
export type ContactPriority = Contact["priority"];

export type ContactSortField = "name" | "priority" | "created_at";
export type SortDirection = "ascending" | "descending";
