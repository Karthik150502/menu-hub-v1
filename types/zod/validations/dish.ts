import { z } from "zod";

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Mirrors the Dish interface. All fields the user can edit are validated here.
// price is kept as a string in the form (TextInput), coerced on output.

export const dishSchema = z.object({
    name: z
        .string()
        .min(1, 'Enter the item name')
        .max(60, 'Item name too long'),

    description: z
        .string()
        .max(200, 'Description too long')
        .optional(),

    // Price is a string in the form — coerce and validate as a number
    basePrice: z
        .string()
        .refine(v => !isNaN(parseFloat(v)), { message: 'Enter a suitable price for the item' })
        .refine(v => parseFloat(v) <= 100_000, { message: 'Price seems too high' }),

    currency: z.string(),
    tag: z.string().optional(),
    category: z
        .string()
        .min(1, 'Please select a category'),

    // Optional — if provided must be a valid http(s) URL
    imageUrl: z
        .string()
        .refine(
            v => v === '' || /^(https?:\/\/).+/.test(v),
            { message: 'Must be a valid URL starting with http(s)://' },
        )
        .optional(),

    available: z.boolean(),
    veg: z.boolean(),
    showInMenu: z.boolean().optional(),
});


export type DishFormValues = z.infer<typeof dishSchema>;