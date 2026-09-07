import { describe, expect, it } from "vitest";

import { contactInputSchema } from "@/features/contacts/validation/contact-schema";

describe("contactInputSchema", () => {
  it("trims and normalizes a valid contact", () => {
    const result = contactInputSchema.parse({
      name: "  Ada Lovelace  ",
      company: "  Analytical Engines  ",
      role: "  Researcher  ",
      where_met: "  Berkeley  ",
      notes: "  Follow up next month.  ",
      priority: "high",
    });

    expect(result).toEqual({
      name: "Ada Lovelace",
      company: "Analytical Engines",
      role: "Researcher",
      where_met: "Berkeley",
      notes: "Follow up next month.",
      priority: "high",
    });
  });

  it.each(["", "   "])("rejects a blank name: %j", (name) => {
    const result = contactInputSchema.safeParse({
      name,
      priority: "medium",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Name is required.");
    }
  });

  it("rejects an invalid priority with a clear message", () => {
    const result = contactInputSchema.safeParse({
      name: "Grace Hopper",
      priority: "urgent",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Priority must be high, medium, or low.",
      );
    }
  });

  it("converts empty optional fields to null", () => {
    const result = contactInputSchema.parse({
      name: "Katherine Johnson",
      company: "   ",
      role: "",
      where_met: null,
      notes: "",
      priority: "low",
    });

    expect(result).toMatchObject({
      company: null,
      role: null,
      where_met: null,
      notes: null,
    });
  });
});
