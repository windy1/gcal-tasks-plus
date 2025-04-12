import { Auth } from "@/constants";
import { Task, TaskList } from "@/data";
import { fetchTasks } from "@/hooks/fetch-tasks";
import { useEffect, useState } from "react";

interface TasksProps {
    taskList: TaskList;
}

export const Tasks: React.FC<TasksProps> = ({ taskList }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const token = localStorage.getItem(Auth.AccessToken);

    if (!token) {
        // should not happen
        throw new Error("No token found");
    }

    useEffect(() => fetchTasks(token, taskList, setTasks), [token, taskList]);

    console.log("tasks", tasks);

    return (
        <div>
            <h2>{taskList.title}</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
};
