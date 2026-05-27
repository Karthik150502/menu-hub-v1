import { z } from "zod";

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Mirrors the Mobile Login interface. All fields the user can edit are validated here.

export const mobileLoginSchema = z.object({
    phone: z
        .string().length(10, "Phone number must be 10 digits")
});


export type PhoneFormValues = z.infer<typeof mobileLoginSchema>;