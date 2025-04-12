import axios from "axios";
import { Auth } from "@/constants";
import { TaskList, TaskListSchema } from "@/data";
import { z } from "zod";

const TaskListsUrl = "https://tasks.googleapis.com/tasks/v1/users/@me/lists";

const getAuthorization = (token: string) => `Bearer ${token}`;

const _fetchTasks = async (token: string, setTaskLists: (taskLists: TaskList[]) => void) => {
    try {
        const res = await axios.get(TaskListsUrl, {
            headers: {
                Authorization: getAuthorization(token),
            },
        });

        setTaskLists(z.array(TaskListSchema).parse(res.data.items));

        return () => {};
    } catch (err) {
        console.error("Failed to fetch tasks", err);
        localStorage.removeItem(Auth.AccessToken);
        localStorage.removeItem(Auth.ExpiresAt);
        return [];
    }
};

export const fetchTasks = (token: string | null, setTaskLists: (taskLists: TaskList[]) => void) => {
    if (!token) {
        return;
    }

    _fetchTasks(token, setTaskLists);

    return () => {};
};
