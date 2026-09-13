import { z } from "zod";

// ─── Zod schema ───────────────────────────────────────────────────────────────
// DatePicker (components/utils/DatePicker.tsx) hands back a native `Date`, so
// the form works with that — dobScreen converts it to the "YYYY-MM-DD" string
// the backend's UserUpdate.date_of_birth (format: date) expects before
// sending.
//
// MIN_AGE_YEARS is a business rule, not a backend constraint — the API just
// takes any past date. Adjust here if the minimum age requirement changes.

const MIN_AGE_YEARS = 18;

function ageInYears(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
}

export const dobSchema = z.object({
    dateOfBirth: z
        .date({ message: "Please select your date of birth" })
        .refine((d) => d <= new Date(), "Date of birth can't be in the future")
        .refine(
            (d) => ageInYears(d) >= MIN_AGE_YEARS,
            `You must be at least ${MIN_AGE_YEARS} to register`,
        ),
});

export type DobFormValues = z.infer<typeof dobSchema>;
