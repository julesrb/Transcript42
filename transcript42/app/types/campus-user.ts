import { z } from "zod";

export const CampusUserSchema = z.object({
    campus_id: z.number(),
    is_primary: z.boolean(),
});

export type CampusUser = z.infer<typeof CampusUserSchema>;
