import { z } from "zod";

const Kind = "tasks#taskList";

export const TaskListSchema = z.object({
    kind: z.literal(Kind),
    id: z.string(),
    etag: z.string(),
    title: z.string(),
    updated: z.string().datetime(),
    selfLink: z.string().url(),
});

export type TaskList = z.infer<typeof TaskListSchema>;
