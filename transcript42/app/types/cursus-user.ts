import { z } from "zod";

export const CursusUserSchema = z.object({
    cursus_id: z.number(),
    grade: z.string().nullable().optional(),
    created_at: z.string(),
    begin_at: z.string(),
});

export type CursusUser = z.infer<typeof CursusUserSchema>;
