import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { CreateTaskPayload, Task, TaskList, TaskListSchema, TaskSchema } from "@/data";
import { z } from "zod";
import { Auth } from ".";
import _ from "lodash";

const MaxTasks = 100;
const Get = "GET";
const Post = "POST";
const Put = "PUT";
const Completed = "completed";
const ShowCompleted = false;

const Urls = {
    taskLists: "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
    tasks: (taskListId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks?maxResults=${MaxTasks}` +
        `&showCompleted=${ShowCompleted}`,
    updateTask: (taskListId: string, taskId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
    createTask: (taskListId: string) =>
        `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`,
};

export const fetchTaskLists = (): Promise<TaskList[]> => get(Urls.taskLists, TaskListSchema);

export const fetchTasks = async (taskList: TaskList): Promise<Task[]> => {
    const res = await get(Urls.tasks(taskList.id), TaskSchema);
    return res.filter((task) => task.title.trim() !== "");
};

export const completeTask = (taskList: TaskList, task: Task): Promise<Task | null> =>
    updateTask(taskList, { ...task, completed: new Date().toISOString(), status: Completed });

export const createTask = (taskList: TaskList, task: CreateTaskPayload): Promise<Task | null> =>
    post(Urls.createTask(taskList.id), TaskSchema, task);

const updateTask = (taskList: TaskList, task: Task): Promise<Task | null> =>
    put(Urls.updateTask(taskList.id, task.id), TaskSchema, task);

const get = async <TResource>(
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
    const token = Auth.getToken();

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
        Auth.clearToken();
        return null;
    }
};

const arrayRoot = (res: AxiosResponse) => res.data.items;

const objectRoot = (res: AxiosResponse) => res.data;

const getConfig = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
