import { z } from "zod";

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Mirrors mobile_login.ts. Full name collected as one field for now.

export const nameSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
});

export type NameFormValues = z.infer<typeof nameSchema>;
