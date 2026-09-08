import type { Database } from "@/lib/neon/database.types";

type ContactsTable = Database["public"]["Tables"]["contacts"];

export type Contact = ContactsTable["Row"];
