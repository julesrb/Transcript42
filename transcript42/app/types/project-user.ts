import { z } from "zod";
import { ProjectSchema } from "./project";

export const ProjectUserSchema = z.object({
    final_mark: z.number().nullable().optional(),
    status: z.string(),
    project: ProjectSchema,
    cursus_ids: z.array(z.number()),
    "validated?": z.boolean().nullable().optional(),
});

export type ProjectUser = z.infer<typeof ProjectUserSchema>;
