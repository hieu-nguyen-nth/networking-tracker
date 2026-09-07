"use client";

import { useState } from "react";

import type { Contact } from "@/features/contacts/types/contact";

type ContactCardProps = Readonly<{
  contact: Contact;
  onDelete: (contactId: string) => Promise<void>;
  onEdit: (contact: Contact) => void;
}>;

const priorityClasses = {
  high: "bg-red-50 text-red-800 ring-red-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
} as const;

export function ContactCard({ contact, onDelete, onEdit }: ContactCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(contact.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-950">
            {contact.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {[contact.role, contact.company].filter(Boolean).join(" at ") ||
              "Role and company not added"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${priorityClasses[contact.priority]}`}
        >
          {contact.priority}
        </span>
      </div>

      <dl className="mt-5 grid gap-4 text-sm">
        <div>
          <dt className="font-medium text-slate-500">Where you met</dt>
          <dd className="mt-1 text-slate-800">
            {contact.where_met || "Not added"}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Notes</dt>
          <dd className="mt-1 whitespace-pre-wrap text-slate-800">
            {contact.notes || "No notes yet"}
          </dd>
        </div>
      </dl>

      {isConfirmingDelete ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900">
            Delete {contact.name}? This cannot be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="min-h-10 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-wait disabled:opacity-60"
              disabled={isDeleting}
              onClick={handleDelete}
              type="button"
            >
              {isDeleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              className="min-h-10 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-100"
              disabled={isDeleting}
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              Keep contact
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
          <button
            className="min-h-10 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            onClick={() => onEdit(contact)}
            type="button"
          >
            Edit
          </button>
          <button
            className="min-h-10 rounded-lg px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
            onClick={() => setIsConfirmingDelete(true)}
            type="button"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
