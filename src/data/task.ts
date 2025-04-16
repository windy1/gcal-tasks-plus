import { TaskApiConstants } from "@/constants";
import { z } from "zod";

/**
 * Schema for Google Task API Task model.
 */
export const TaskSchema = z.object({
    kind: z.literal(TaskApiConstants.TaskKind),
    id: z.string(),
    etag: z.string(),
    title: z.string(),
    updated: z.string().datetime(),
    selfLink: z.string().url(),
    position: z.string(),
    status: z.string(),
    due: z.string().datetime().optional().nullable(),
    completed: z.string().datetime().optional().nullable(),
    links: z.array(z.unknown()),
    webViewLink: z.string().url(),
});

/**
 * The type of a Google Task.
 */
export type Task = z.infer<typeof TaskSchema>;
