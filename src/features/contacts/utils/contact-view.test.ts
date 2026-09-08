import { describe, expect, it } from "vitest";

import type { Contact } from "@/features/contacts/types/contact";
import { getVisibleContacts } from "@/features/contacts/utils/contact-view";

const contacts: Contact[] = [
  {
    id: "1",
    user_id: "user-a",
    name: "Maya Chen",
    company: "Berkeley SkyDeck",
    role: "Designer",
    where_met: "Demo day",
    notes: "Discuss portfolios",
    priority: "high",
    created_at: "2026-09-02T00:00:00.000Z",
    updated_at: "2026-09-02T00:00:00.000Z",
  },
  {
    id: "2",
    user_id: "user-a",
    name: "Alex Rivera",
    company: "Cal Alumni",
    role: "Mentor",
    where_met: "Coffee chat",
    notes: null,
    priority: "low",
    created_at: "2026-09-03T00:00:00.000Z",
    updated_at: "2026-09-03T00:00:00.000Z",
  },
];

describe("contact list view", () => {
  it("searches across contact details without case sensitivity", () => {
    const result = getVisibleContacts(contacts, {
      priority: "all",
      query: "SKYDECK",
      sort: "newest",
    });

    expect(result.map((contact) => contact.name)).toEqual(["Maya Chen"]);
  });

  it("filters by priority", () => {
    const result = getVisibleContacts(contacts, {
      priority: "low",
      query: "",
      sort: "newest",
    });

    expect(result.map((contact) => contact.name)).toEqual(["Alex Rivera"]);
  });

  it("sorts contacts without mutating the stored order", () => {
    const result = getVisibleContacts(contacts, {
      priority: "all",
      query: "",
      sort: "name",
    });

    expect(result.map((contact) => contact.name)).toEqual([
      "Alex Rivera",
      "Maya Chen",
    ]);
    expect(contacts.map((contact) => contact.name)).toEqual([
      "Maya Chen",
      "Alex Rivera",
    ]);
  });

  it("sorts recent contacts by their updated date", () => {
    const changedContacts = contacts.map((contact) =>
      contact.id === "1"
        ? { ...contact, updated_at: "2026-09-05T00:00:00.000Z" }
        : contact,
    );

    const result = getVisibleContacts(changedContacts, {
      priority: "all",
      query: "",
      sort: "newest",
    });

    expect(result.map((contact) => contact.name)).toEqual([
      "Maya Chen",
      "Alex Rivera",
    ]);
  });
});
