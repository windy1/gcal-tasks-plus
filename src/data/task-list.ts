import { z } from "zod";

const Kind = "tasks#taskList";

/**
 * Schema for Google Task API TaskList model.
 */
export const TaskListSchema = z.object({
    kind: z.literal(Kind),
    id: z.string(),
    etag: z.string(),
    title: z.string(),
    updated: z.string().datetime(),
    selfLink: z.string().url(),
});

/**
 * The type of a Google TaskList.
 */
export type TaskList = z.infer<typeof TaskListSchema>;
