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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          {contact ? "Edit contact" : "New contact"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {contact ? `Update ${contact.name}` : "Add someone to your network"}
        </h2>
      </div>

      <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Name <span className="text-red-700">*</span>
          <input
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="name"
            className="min-h-11 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="e.g. Maya Chen"
            value={draft.name}
          />
          {fieldErrors.name ? (
            <span className="text-sm text-red-700" id="name-error">
              {fieldErrors.name}
            </span>
          ) : null}
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Company
            <input
              autoComplete="organization"
              className="min-h-11 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="e.g. Berkeley SkyDeck"
              value={draft.company}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Role
            <input
              autoComplete="organization-title"
              className="min-h-11 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => updateField("role", event.target.value)}
              placeholder="e.g. Product designer"
              value={draft.role}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Where you met
          <input
            className="min-h-11 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => updateField("where_met", event.target.value)}
            placeholder="e.g. Haas networking night"
            value={draft.where_met}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Priority
          <select
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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

        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Notes
          <textarea
            className="min-h-28 resize-y rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="What did you discuss? What should you remember?"
            value={draft.notes}
          />
        </label>

        {formError ? (
          <p
            aria-live="polite"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {formError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            className="min-h-11 rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
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
