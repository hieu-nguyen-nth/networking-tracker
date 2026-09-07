"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { AccountMenu } from "@/features/account/components/account-menu";
import { ContactControls } from "@/features/contacts/components/contact-controls";
import { ContactForm } from "@/features/contacts/components/contact-form";
import { ContactList } from "@/features/contacts/components/contact-list";
import { useContacts } from "@/features/contacts/hooks/use-contacts";
import type { Contact } from "@/features/contacts/types/contact";
import type { ContactInput } from "@/features/contacts/validation/contact-schema";
import {
  getVisibleContacts,
  type ContactPriorityFilter,
  type ContactSort,
} from "@/features/contacts/utils/contact-view";

type EditorState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; contact: Contact };

export function ContactDashboard() {
  const { contacts, status, loadError, reload, add, update, remove } =
    useContacts();
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<ContactPriorityFilter>("all");
  const [sort, setSort] = useState<ContactSort>("newest");
  const deferredQuery = useDeferredValue(query);
  const visibleContacts = useMemo(
    () =>
      getVisibleContacts(contacts, {
        priority,
        query: deferredQuery,
        sort,
      }),
    [contacts, deferredQuery, priority, sort],
  );
  const hasActiveFilters = query.trim().length > 0 || priority !== "all";

  function clearFilters() {
    setQuery("");
    setPriority("all");
  }

  function openCreateForm() {
    setNotice(null);
    setActionError(null);
    setEditor({ mode: "create" });
  }

  function openEditForm(contact: Contact) {
    setNotice(null);
    setActionError(null);
    setEditor({ mode: "edit", contact });
  }

  async function handleSave(input: ContactInput) {
    if (editor.mode === "edit") {
      const saved = await update(editor.contact.id, input);
      setNotice(`${saved.name} was updated.`);
    } else {
      const saved = await add(input);
      setNotice(`${saved.name} was added.`);
    }

    setEditor({ mode: "closed" });
  }

  async function handleDelete(contactId: string) {
    setNotice(null);
    setActionError(null);

    try {
      const contactName =
        contacts.find((contact) => contact.id === contactId)?.name ?? "Contact";
      await remove(contactId);
      if (editor.mode === "edit" && editor.contact.id === contactId) {
        setEditor({ mode: "closed" });
      }
      setNotice(`${contactName} was deleted.`);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "We could not delete that contact.",
      );
      throw error;
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF5] px-5 py-6 text-[#191918] sm:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#E3E2D8] pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A71D31]">
              Berkeley Networking Tracker
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em]">
              Your contacts
            </h1>
          </div>
          <AccountMenu />
        </header>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-[-0.02em]">People in your network</h2>
            <p className="mt-1 text-sm text-[#75756F]">
              {status === "ready"
                ? `${contacts.length} ${contacts.length === 1 ? "contact" : "contacts"}`
                : "Your private contact list"}
            </p>
          </div>
          {editor.mode === "closed" ? (
            <button
              className="min-h-11 bg-[#A71D31] px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#851526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
              onClick={openCreateForm}
              type="button"
            >
              Add contact
            </button>
          ) : null}
        </div>

        {notice ? (
          <p
            aria-live="polite"
            className="mt-6 border border-[#BFCBB8] bg-[#EFF3EA] p-4 text-sm text-[#30442C]"
          >
            {notice}
          </p>
        ) : null}

        {actionError ? (
          <p
            aria-live="polite"
            className="mt-6 border border-[#D7AAB1] bg-[#F7EDEF] p-4 text-sm text-[#711524]"
          >
            {actionError}
          </p>
        ) : null}

        <div
          className={`mt-6 grid items-start gap-6 ${editor.mode === "closed" ? "" : "lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.75fr)]"}`}
        >
          <div>
            {status === "loading" ? (
              <section
                aria-busy="true"
                aria-live="polite"
                className="border border-[#E3E2D8] bg-[#F4F4EB] p-10 text-center"
              >
                <p className="text-[#474744]">
                  Loading your contacts…
                </p>
              </section>
            ) : null}

            {status === "error" ? (
              <section className="border border-[#D7AAB1] bg-[#F7EDEF] p-8 text-center">
                <h3 className="text-lg font-medium text-[#711524]">
                  Contacts could not be loaded
                </h3>
                <p className="mt-2 text-sm text-[#8A2637]">{loadError}</p>
                <button
                  className="mt-5 min-h-11 bg-[#A71D31] px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#851526]"
                  onClick={() => void reload()}
                  type="button"
                >
                  Try again
                </button>
              </section>
            ) : null}

            {status === "ready" ? (
              <>
                {contacts.length > 0 ? (
                  <ContactControls
                    onPriorityChange={setPriority}
                    onQueryChange={setQuery}
                    onSortChange={setSort}
                    priority={priority}
                    query={query}
                    resultCount={visibleContacts.length}
                    sort={sort}
                    totalCount={contacts.length}
                  />
                ) : null}
                <ContactList
                  contacts={visibleContacts}
                  hasActiveFilters={hasActiveFilters}
                  onAdd={openCreateForm}
                  onClearFilters={clearFilters}
                  onDelete={handleDelete}
                  onEdit={openEditForm}
                />
              </>
            ) : null}
          </div>

          {editor.mode !== "closed" ? (
            <ContactForm
              contact={editor.mode === "edit" ? editor.contact : undefined}
              key={editor.mode === "edit" ? editor.contact.id : "new-contact"}
              onCancel={() => setEditor({ mode: "closed" })}
              onSave={handleSave}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
