import type {
  Contact,
  ContactInsert,
  ContactUpdate,
} from "@/features/contacts/types/contact";
import { neonClient } from "@/lib/neon/client";

export class ContactDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactDataError";
  }
}

export async function listContacts(): Promise<Contact[]> {
  const { data, error } = await neonClient
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new ContactDataError("We could not load your contacts.");
  }

  return data ?? [];
}

export async function createContact(input: ContactInsert): Promise<Contact> {
  const { data, error } = await neonClient
    .from("contacts")
    .insert(input)
    .select()
    .single();

  if (error || !data) {
    throw new ContactDataError("We could not create that contact.");
  }

  return data;
}

export async function updateContact(
  contactId: string,
  input: ContactUpdate,
): Promise<Contact> {
  const { data, error } = await neonClient
    .from("contacts")
    .update(input)
    .eq("id", contactId)
    .select()
    .single();

  if (error || !data) {
    throw new ContactDataError("We could not update that contact.");
  }

  return data;
}

export async function deleteContact(contactId: string): Promise<void> {
  const { error } = await neonClient
    .from("contacts")
    .delete()
    .eq("id", contactId);

  if (error) {
    throw new ContactDataError("We could not delete that contact.");
  }
}
