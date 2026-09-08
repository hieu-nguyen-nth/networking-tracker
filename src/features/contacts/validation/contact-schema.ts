import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .optional();

export const contactInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  company: optionalText,
  role: optionalText,
  where_met: optionalText,
  notes: optionalText,
  priority: z.enum(["high", "medium", "low"], {
    error: "Priority must be high, medium, or low.",
  }),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
