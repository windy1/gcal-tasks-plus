import { z } from "zod";

const Kind = "tasks#task";

export const TaskSchema = z.object({
    kind: z.literal(Kind),
    id: z.string(),
    etag: z.string(),
    title: z.string(),
    updated: z.string().datetime(),
    selfLink: z.string().url(),
    position: z.string(),
    status: z.string(),
    due: z.string().datetime(),
    completed: z.string().datetime().optional().nullable(),
    links: z.array(z.unknown()),
    webViewLink: z.string().url(),
});

export type Task = z.infer<typeof TaskSchema>;
