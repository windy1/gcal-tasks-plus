import { Task } from "@/data";
import {
    DecrementBackgroundTaskCount,
    IncrementBackgroundTaskCount,
    PutTask,
    SetEditingTaskId,
    SetLoading,
    SetSaveState,
    SetTasks,
} from "@/reducers";
import { SaveState } from "@/types";

export const setTasks = (tasks: Task[]) => ({
    type: SetTasks,
    payload: tasks,
});

export const putTask = (task: Task) => ({
    type: PutTask,
    payload: task,
});

export const setLoading = (isLoading: boolean) => ({
    type: SetLoading,
    payload: isLoading,
});

export const incrementBackgroundTaskCount = () => ({
    type: IncrementBackgroundTaskCount,
});

export const decrementBackgroundTaskCount = () => ({
    type: DecrementBackgroundTaskCount,
});

export const setSaveState = (saveState: SaveState) => ({
    type: SetSaveState,
    payload: saveState,
});

export const setEditingTaskId = (editingTaskId: string | null) => ({
    type: SetEditingTaskId,
    payload: editingTaskId,
});
