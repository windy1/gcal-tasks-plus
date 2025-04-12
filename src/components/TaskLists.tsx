import { TaskList } from "@/data";
import React from "react";

interface TaskListsProps {
    tasks: TaskList[];
}

export const TaskLists: React.FC<TaskListsProps> = ({ tasks }) => {
    return (
        <div>
            <h2>Your Task Lists</h2>
            <ul>
                {tasks.map((list) => (
                    <li key={list.id}>{list.title}</li>
                ))}
            </ul>
        </div>
    );
};
