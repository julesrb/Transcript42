import { z } from "zod";
import { ProjectSchema } from "./project";

export const ProjectUserSchema = z.object({
    final_mark: z.number().nullable().optional(),
    project: ProjectSchema,
    cursus_ids: z.array(z.number()),
    marked_at: z.string().nullable().optional(),
    'validated?': z.boolean().nullable().optional(),
});

export type ProjectUser = z.infer<typeof ProjectUserSchema>;
