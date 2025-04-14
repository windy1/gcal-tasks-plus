import axios from "axios";
import { Task, TaskList, TaskListSchema, TaskSchema } from "@/data";
import { z } from "zod";
import { getAuthorization } from "@/utils/auth";
import { Auth } from ".";

const Urls = {
    taskLists: "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
    tasks: (taskListId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`,
    updateTask: (taskListId: string, taskId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
};

export const fetchTaskLists = (): Promise<TaskList[]> => get(Urls.taskLists, TaskListSchema);

export const fetchTasks = (taskList: TaskList): Promise<Task[]> =>
    get(Urls.tasks(taskList.id), TaskSchema);

export const updateTask = async (taskListId: string, taskId: string, task: Task) => {
    const url = Urls.updateTask(taskListId, taskId);
    const token = Auth.getToken();

    if (!token) {
        return;
    }

    try {
        const res = await axios.put(url, task, getConfig(token));
        return TaskSchema.parse(res.data);
    } catch (err) {
        console.error(`Failed to update resource: ${url}`, err);
        Auth.clearToken();
        return null;
    }
};

const get = async <TResource>(url: string, schema: z.ZodSchema<TResource>) => {
    const token = Auth.getToken();

    if (!token) {
        return [];
    }

    try {
        const res = await axios.get(url, getConfig(token));
        return z.array(schema).parse(res.data.items);
    } catch (err) {
        console.error(`Failed to fetch resource: ${url}`, err);
        Auth.clearToken();
        return [];
    }
};

const getConfig = (token: string) => ({
    headers: {
        Authorization: getAuthorization(token),
    },
});
