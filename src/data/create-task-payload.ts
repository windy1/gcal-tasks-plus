import { TaskApiConstants } from "@/constants";

export interface CreateTaskPayload {
    kind: string;
    title: string;
}

export const NewCreateTaskPayload = (title: string): CreateTaskPayload => ({
    kind: TaskApiConstants.TaskKind,
    title,
});
