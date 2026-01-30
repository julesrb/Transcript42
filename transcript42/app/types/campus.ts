import { z } from "zod";

export const CampusSchema = z.object({
    id: z.number(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
});

export type Campus = z.infer<typeof CampusSchema>;
