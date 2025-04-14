import { TaskApiConstants } from "@/constants";

export interface NewTask {
    kind: string;
    title: string;
}

export const CreateNewTask = (title: string): NewTask => ({
    kind: TaskApiConstants.TaskKind,
    title,
});
