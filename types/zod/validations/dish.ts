import { z } from "zod";

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Mirrors the Dish interface. All fields the user can edit are validated here.
// price is kept as a string in the form (TextInput), coerced on output.

export const dishSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(60, 'Name must be 60 characters or fewer'),

    description: z
        .string()
        .min(10, 'Add a bit more detail (min 10 chars)')
        .max(200, 'Keep it under 200 characters'),

    // Price is a string in the form — coerce and validate as a number
    price: z
        .string()
        .min(1, 'Price is required')
        .refine(v => !isNaN(parseFloat(v)), { message: 'Must be a number' })
        .refine(v => parseFloat(v) > 0, { message: 'Price must be greater than 0' })
        .refine(v => parseFloat(v) <= 100_000, { message: 'Price seems too high' }),

    currency: z.string().min(1, 'Currency is required'),

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