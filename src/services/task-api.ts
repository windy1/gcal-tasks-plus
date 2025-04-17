import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { CreateTaskPayload, Task, TaskList, TaskListSchema, TaskSchema } from "@/data";
import { z } from "zod";
import { AuthStorage } from ".";
import _ from "lodash";

const MaxTasks = 100;
const Completed = "completed";
const ShowCompleted = false;

const Get = "GET";
const Post = "POST";
const Put = "PUT";

const Urls = {
    TaskLists: () => "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
    Tasks: (taskListId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks` +
        `?maxResults=${MaxTasks}` +
        `&showCompleted=${ShowCompleted}`,
    UpdateTask: (taskListId: string, taskId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
    CreateTask: (taskListId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`,
};

/**
 * Returns the task lists for the authenticated user.
 *
 * @returns TaskList[] - The task lists for the authenticated user, or an empty array if none are found.
 */
export const fetchTaskLists = (): Promise<TaskList[]> => list(Urls.TaskLists(), TaskListSchema);

/**
 * Returns the tasks for the given task list.
 *
 * @param taskList TaskList to fetch tasks for
 * @returns Task[] - The tasks for the given task list, or an empty array if none are found.
 */
export const fetchTasks = async (taskList: TaskList): Promise<Task[]> => {
    const res = await list(Urls.Tasks(taskList.id), TaskSchema);
    return res.filter((task) => task.title.trim() !== "");
};

/**
 * Updates the given task to a completed status.
 *
 * @param taskList TaskList to update the task in
 * @param task Task to update
 * @returns The updated task, or null if the update failed.
 */
export const completeTask = (taskList: TaskList, task: Task): Promise<Task | null> =>
    updateTask(taskList, { ...task, completed: new Date().toISOString(), status: Completed });

/**
 * Creates a new task in the given task list.
 *
 * @param taskList TaskList to add the Task to
 * @param payload Payload to create the Task
 * @returns The created task, or null if the creation failed.
 */
export const createTask = (taskList: TaskList, payload: CreateTaskPayload): Promise<Task | null> =>
    post(Urls.CreateTask(taskList.id), TaskSchema, payload);

const updateTask = (taskList: TaskList, task: Task): Promise<Task | null> =>
    put(Urls.UpdateTask(taskList.id, task.id), TaskSchema, task);

const list = async <TResource>(
    url: string,
    schema: z.ZodSchema<TResource>,
): Promise<TResource[]> => {
    const res = await send(url, z.array(schema), Get, arrayRoot);
    return res !== null ? res : [];
};

const put = <TResource>(
    url: string,
    schema: z.ZodSchema<TResource>,
    data: unknown,
): Promise<TResource | null> => send(url, schema, Put, objectRoot, data);

const post = <TResource>(
    url: string,
    schema: z.ZodSchema<TResource>,
    data: unknown,
): Promise<TResource | null> => send(url, schema, Post, objectRoot, data);

const send = async <TResource>(
    url: string,
    schema: z.ZodSchema<TResource>,
    method: Method,
    getContentRoot: (res: AxiosResponse) => unknown,
    data: unknown | null = null,
    additionalConfig: Partial<AxiosRequestConfig> = {},
): Promise<TResource | null> => {
    const token = AuthStorage.getToken();

    if (!token) {
        return null;
    }

    try {
        let config: AxiosRequestConfig = {
            url,
            method,
            data,
            ...getConfig(token),
        };

        config = _.merge(config, additionalConfig);

        console.debug(`${method} ${url}`, config);

        const res = await axios.request(config);
        return schema.parse(getContentRoot(res));
    } catch (err) {
        console.error(`Failed request: ${method} ${url}`, err);
        AuthStorage.clearToken();
        return null;
    }
};

const arrayRoot = (res: AxiosResponse) => res.data?.items;

const objectRoot = (res: AxiosResponse) => res.data;

const getConfig = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
