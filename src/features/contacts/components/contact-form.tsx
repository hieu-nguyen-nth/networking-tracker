"use client";

import { useState } from "react";

import type { Contact } from "@/features/contacts/types/contact";
import {
  contactInputSchema,
  type ContactInput,
} from "@/features/contacts/validation/contact-schema";

type ContactFormProps = Readonly<{
  contact?: Contact;
  onCancel: () => void;
  onSave: (input: ContactInput) => Promise<void>;
}>;

type ContactDraft = {
  name: string;
  company: string;
  role: string;
  where_met: string;
  notes: string;
  priority: "high" | "medium" | "low";
};

type FieldErrors = Partial<Record<keyof ContactDraft, string>>;

function createDraft(contact?: Contact): ContactDraft {
  return {
    name: contact?.name ?? "",
    company: contact?.company ?? "",
    role: contact?.role ?? "",
    where_met: contact?.where_met ?? "",
    notes: contact?.notes ?? "",
    priority: contact?.priority ?? "medium",
  };
}

export function ContactForm({ contact, onCancel, onSave }: ContactFormProps) {
  const [draft, setDraft] = useState<ContactDraft>(() => createDraft(contact));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateField<Key extends keyof ContactDraft>(
    field: Key,
    value: ContactDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const result = contactInputSchema.safeParse(draft);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactDraft | undefined;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(result.data);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "We could not save that contact.",
      );
      setIsSaving(false);
    }
  }

  return (
    <section className="order-first border border-[#E3E2D8] bg-[#F4F4EB] p-6 sm:p-8 lg:p-10">
      <div className="mb-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A71D31]">
          {contact ? "Edit contact" : "New contact"}
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em]">
          {contact ? `Update ${contact.name}` : "Add someone to your network"}
        </h2>
      </div>

      <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
        <div className="grid items-start gap-5 sm:grid-cols-2 sm:gap-x-8">
          <label className="grid content-start gap-2 text-base text-[#474744]">
            <span>
              Name <span className="text-[#A71D31]">*</span>
            </span>
            <input
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              aria-invalid={Boolean(fieldErrors.name)}
              autoComplete="name"
              className="min-h-12 w-full border border-[#C9C8BD] bg-[#FAFAF5] px-4 py-3 text-base text-[#191918] outline-none transition-colors placeholder:text-[#8B8B84] focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]"
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. Maya Chen"
              value={draft.name}
            />
            {fieldErrors.name ? (
              <span className="text-sm text-[#A71D31]" id="name-error">
                {fieldErrors.name}
              </span>
            ) : null}
          </label>
          <label className="grid content-start gap-2 text-base text-[#474744]">
            Company
            <input
              autoComplete="organization"
              className="min-h-12 w-full border border-[#C9C8BD] bg-[#FAFAF5] px-4 py-3 text-base text-[#191918] outline-none transition-colors placeholder:text-[#8B8B84] focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]"
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="e.g. Berkeley SkyDeck"
              value={draft.company}
            />
          </label>
        </div>

        <div className="grid items-start gap-5 sm:grid-cols-2 sm:gap-x-8">
          <label className="grid content-start gap-2 text-base text-[#474744]">
            Role
            <input
              autoComplete="organization-title"
              className="min-h-12 w-full border border-[#C9C8BD] bg-[#FAFAF5] px-4 py-3 text-base text-[#191918] outline-none transition-colors placeholder:text-[#8B8B84] focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]"
              onChange={(event) => updateField("role", event.target.value)}
              placeholder="e.g. Product designer"
              value={draft.role}
            />
          </label>
          <label className="grid content-start gap-2 text-base text-[#474744]">
            Where you met
            <input
              className="min-h-12 w-full border border-[#C9C8BD] bg-[#FAFAF5] px-4 py-3 text-base text-[#191918] outline-none transition-colors placeholder:text-[#8B8B84] focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]"
              onChange={(event) => updateField("where_met", event.target.value)}
              placeholder="e.g. Haas networking night"
              value={draft.where_met}
            />
          </label>
        </div>

        <div className="grid items-start gap-5 sm:grid-cols-2 sm:gap-x-8">
          <label className="grid content-start gap-2 text-base text-[#474744]">
            Notes
            <textarea
              className="min-h-28 w-full resize-y border border-[#C9C8BD] bg-[#FAFAF5] px-4 py-3 text-base text-[#191918] outline-none transition-colors placeholder:text-[#8B8B84] focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]"
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="What did you discuss? What should you remember?"
              value={draft.notes}
            />
          </label>

          <label className="grid content-start gap-2 text-base text-[#474744]">
            Priority
            <select
              className="min-h-12 w-full border border-[#C9C8BD] bg-[#FAFAF5] px-4 py-3 text-base text-[#191918] outline-none transition-colors focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]"
              onChange={(event) =>
                updateField(
                  "priority",
                  event.target.value as ContactDraft["priority"],
                )
              }
              value={draft.priority}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>

        {formError ? (
          <p
            aria-live="polite"
            className="border border-[#D7AAB1] bg-[#F7EDEF] p-3 text-sm text-[#711524]"
          >
            {formError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <button
            className="min-h-11 border border-[#C9C8BD] px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#191918] transition-colors hover:bg-[#ECEBE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 bg-[#A71D31] px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#851526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31] disabled:cursor-wait disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving…" : contact ? "Save changes" : "Add contact"}
          </button>
        </div>
      </form>
    </section>
  );
}
