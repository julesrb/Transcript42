import { z } from "zod";

export const ProjectSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const CampusSchema = z.object({
    id: z.number(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
});

export const ProjectUserSchema = z.object({
    final_mark: z.number().nullable().optional(),
    status: z.string(),
    project: ProjectSchema,
    cursus_ids: z.array(z.number()),
    "validated?": z.boolean().nullable().optional(),
});

export const CursusUserSchema = z.object({
    cursus_id: z.number(),
    grade: z.string().nullable().optional(),
});

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
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectUser = z.infer<typeof ProjectUserSchema>;
