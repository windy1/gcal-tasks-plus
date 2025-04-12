import axios from "axios";
import { Auth } from "@/constants";
import { TaskList, TaskListSchema } from "@/data";
import { z } from "zod";
import { getAuthorization } from "@/utils/auth";

const TaskListsUrl = "https://tasks.googleapis.com/tasks/v1/users/@me/lists";

const _fetchTaskLists = async (token: string, setTaskLists: (taskLists: TaskList[]) => void) => {
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

export const fetchTaskLists = (
    token: string | null,
    setTaskLists: (taskLists: TaskList[]) => void,
) => {
    if (!token) {
        return;
    }

    _fetchTaskLists(token, setTaskLists);

    return () => {};
};
