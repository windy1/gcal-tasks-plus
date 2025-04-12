import { Auth } from "@/constants";
import { Task, TaskList, TaskSchema } from "@/data";
import { getAuthorization } from "@/utils/auth";
import axios from "axios";
import { z } from "zod";

const TasksUrl = (taskListId: string) =>
    `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`;

const _fetchTasks = async (
    token: string,
    taskList: TaskList,
    setTasks: (tasks: Task[]) => void,
) => {
    try {
        const res = await axios.get(TasksUrl(taskList.id), {
            headers: {
                Authorization: getAuthorization(token),
            },
        });

        setTasks(z.array(TaskSchema).parse(res.data.items));

        return () => {};
    } catch (err) {
        console.error("Failed to fetch tasks", err);
        localStorage.removeItem(Auth.AccessToken);
        localStorage.removeItem(Auth.ExpiresAt);
        return [];
    }
};

export const fetchTasks = (
    token: string | null,
    taskList: TaskList,
    setTasks: (tasks: Task[]) => void,
) => {
    if (!token) {
        return;
    }

    _fetchTasks(token, taskList, setTasks);

    return () => {};
};
