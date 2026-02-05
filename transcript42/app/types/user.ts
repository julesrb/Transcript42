import { z } from "zod";
import { CampusUserSchema } from "./campus-user";
import { CursusUserSchema } from "./cursus-user";
import { ProjectUserSchema } from "./project-user";

export const UserSchema = z.object({
    id: z.number(),
    login: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    pool_month: z.string().nullable(),
    pool_year: z.string().nullable(),
    cursus_users: z.array(CursusUserSchema).optional(),
    projects_users: z.array(ProjectUserSchema).optional(),
    campus_users: z.array(CampusUserSchema),
});

export type User = z.infer<typeof UserSchema>;
