import { z } from "zod";

export const UserFormDataSchema = z.object({
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    location_of_birth: z.string().min(1, "Location of birth is required"),
    language: z.string().min(1, "Language is required"),
    transcript_type: z.string().min(1, "Transcript type is required"),
});

export type UserFormData = z.infer<typeof UserFormDataSchema>;
