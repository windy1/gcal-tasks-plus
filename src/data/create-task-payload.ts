import { TaskApiConstants } from "@/constants";

/**
 * Payload to create a new task.
 */
export interface CreateTaskPayload {
    kind: string;
    due: string;
    title: string;
}

/**
 * Creates a new task payload.
 *
 * @param title - The title of the task.
 * @returns New task payload.
 */
export const NewCreateTaskPayload = (title: string): CreateTaskPayload => ({
    kind: TaskApiConstants.TaskKind,
    due: new Date().toISOString(),
    title,
});
