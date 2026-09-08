"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createContact,
  deleteContact,
  listContacts,
  updateContact,
} from "@/features/contacts/data/contact-repository";
import type { Contact } from "@/features/contacts/types/contact";
import type { ContactInput } from "@/features/contacts/validation/contact-schema";

type ContactsStatus = "loading" | "ready" | "error";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [status, setStatus] = useState<ContactsStatus>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchContacts = useCallback((signal?: AbortSignal) => {
    return listContacts()
      .then((savedContacts) => {
        if (signal?.aborted) return;
        setContacts(savedContacts);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (signal?.aborted) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "We could not load your contacts.",
        );
        setStatus("error");
      });
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    setLoadError(null);
    await fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchContacts(controller.signal);

    return () => controller.abort();
  }, [fetchContacts]);

  const add = useCallback(async (input: ContactInput) => {
    const contact = await createContact(input);
    setContacts((current) => [contact, ...current]);
    return contact;
  }, []);

  const update = useCallback(async (contactId: string, input: ContactInput) => {
    const contact = await updateContact(contactId, input);
    setContacts((current) =>
      current.map((item) => (item.id === contactId ? contact : item)),
    );
    return contact;
  }, []);

  const remove = useCallback(async (contactId: string) => {
    await deleteContact(contactId);
    setContacts((current) =>
      current.filter((contact) => contact.id !== contactId),
    );
  }, []);

  return {
    contacts,
    status,
    loadError,
    reload: load,
    add,
    update,
    remove,
  };
}
