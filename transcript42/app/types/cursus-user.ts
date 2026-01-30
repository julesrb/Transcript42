import { z } from "zod";

export const CursusUserSchema = z.object({
    cursus_id: z.number(),
    grade: z.string().nullable().optional(),
});

export type CursusUser = z.infer<typeof CursusUserSchema>;
