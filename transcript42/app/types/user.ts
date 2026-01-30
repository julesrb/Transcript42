import { z } from "zod";
import { CampusSchema } from "./campus";
import { CursusUserSchema } from "./cursus-user";
import { ProjectUserSchema } from "./project-user";

export const UserSchema = z.object({
    id: z.number(),
    login: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    campus: z.array(CampusSchema).optional(),
    cursus_users: z.array(CursusUserSchema).optional(),
    projects_users: z.array(ProjectUserSchema).optional(),
});

export type User = z.infer<typeof UserSchema>;
