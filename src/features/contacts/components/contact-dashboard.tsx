"use client";

import { useState } from "react";

import { AccountMenu } from "@/features/account/components/account-menu";
import { ContactForm } from "@/features/contacts/components/contact-form";
import { ContactList } from "@/features/contacts/components/contact-list";
import { useContacts } from "@/features/contacts/hooks/use-contacts";
import type { Contact } from "@/features/contacts/types/contact";
import type { ContactInput } from "@/features/contacts/validation/contact-schema";

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
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Berkeley Networking Tracker
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Your contacts
            </h1>
          </div>
          <AccountMenu />
        </header>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">People in your network</h2>
            <p className="mt-1 text-sm text-slate-600">
              {status === "ready"
                ? `${contacts.length} ${contacts.length === 1 ? "contact" : "contacts"}`
                : "Your private contact list"}
            </p>
          </div>
          {editor.mode === "closed" ? (
            <button
              className="min-h-11 rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900"
          >
            {notice}
          </p>
        ) : null}

        {actionError ? (
          <p
            aria-live="polite"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-900"
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
                className="rounded-3xl border border-slate-200 bg-white p-10 text-center"
              >
                <p className="font-medium text-slate-700">
                  Loading your contacts…
                </p>
              </section>
            ) : null}

            {status === "error" ? (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-red-950">
                  Contacts could not be loaded
                </h3>
                <p className="mt-2 text-sm text-red-800">{loadError}</p>
                <button
                  className="mt-5 min-h-11 rounded-xl bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800"
                  onClick={() => void reload()}
                  type="button"
                >
                  Try again
                </button>
              </section>
            ) : null}

            {status === "ready" ? (
              <ContactList
                contacts={contacts}
                onAdd={openCreateForm}
                onDelete={handleDelete}
                onEdit={openEditForm}
              />
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
