import { TaskList } from "@/data";

export const TaskOrderStorage = (taskList: TaskList) => {
    const storageKey = getStorageKey(taskList);

    return {
        get() {
            return localStorage.getItem(storageKey);
        },

        save(orderedIds: string[]) {
            localStorage.setItem(storageKey, JSON.stringify(orderedIds));
        },
    };
};

const getStorageKey = (taskList: TaskList) => `task-order-${taskList.id}`;
