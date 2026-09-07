"use client";

import { useState } from "react";

import type { Contact } from "@/features/contacts/types/contact";

type ContactCardProps = Readonly<{
  contact: Contact;
  onDelete: (contactId: string) => Promise<void>;
  onEdit: (contact: Contact) => void;
}>;

const priorityClasses = {
  high: "bg-[#F7EDEF] text-[#8A2637] ring-[#D7AAB1]",
  medium: "bg-[#F5F0DF] text-[#795E1B] ring-[#D8CA9F]",
  low: "bg-[#EFF3EA] text-[#496344] ring-[#BFCBB8]",
} as const;

function formatUpdatedDate(value: string) {
  const date = new Date(value);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
}

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
    <article className="border border-[#E3E2D8] bg-[#F4F4EB] p-5 transition-colors hover:bg-[#ECEBE0]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium tracking-[-0.02em] text-[#191918]">
            {contact.name}
          </h3>
          <p className="mt-1 text-sm text-[#75756F]">
            {[contact.role, contact.company].filter(Boolean).join(" at ") ||
              "Role and company not added"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${priorityClasses[contact.priority]}`}
        >
          {contact.priority}
        </span>
      </div>

      <dl className="mt-5 grid gap-4 text-sm">
        <div>
          <dt className="text-sm font-medium tracking-normal text-[#474744]">Where you met</dt>
          <dd className="mt-1 font-normal tracking-normal text-[#75756F]">
            {contact.where_met || "Not added"}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium tracking-normal text-[#474744]">Notes</dt>
          <dd className="mt-1 whitespace-pre-wrap font-normal tracking-normal text-[#75756F]">
            {contact.notes || "No notes yet"}
          </dd>
        </div>
      </dl>

      {isConfirmingDelete ? (
        <div className="mt-5 border border-[#D7AAB1] bg-[#F7EDEF] p-4">
          <p className="text-sm text-[#711524]">
            Delete {contact.name}? This cannot be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="min-h-10 bg-[#A71D31] px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-white hover:bg-[#851526] disabled:cursor-wait disabled:opacity-60"
              disabled={isDeleting}
              onClick={handleDelete}
              type="button"
            >
              {isDeleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              className="min-h-10 border border-[#D7AAB1] bg-[#FAFAF5] px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#711524] hover:bg-[#EAD1D6]"
              disabled={isDeleting}
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              Keep contact
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3E2D8] pt-3">
          <p className="text-xs font-normal tracking-normal text-[#75756F]">
            Updated {formatUpdatedDate(contact.updated_at)}
          </p>
          <div className="flex items-center justify-end gap-1">
            <button
              className="min-h-9 border border-[#C9C8BD] px-3 py-1.5 text-sm font-medium tracking-normal text-[#191918] hover:bg-[#FAFAF5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
              onClick={() => onEdit(contact)}
              type="button"
            >
              Edit
            </button>
            <button
              className="min-h-9 px-3 py-1.5 text-sm font-medium tracking-normal text-[#A71D31] hover:bg-[#F7EDEF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
              onClick={() => setIsConfirmingDelete(true)}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
