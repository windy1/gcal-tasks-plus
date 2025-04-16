import { TaskList } from "@/data";

/**
 * Handles the storage of task order in local storage.
 *
 * @param taskList TaskList to store the order for
 * @returns An object with methods to get and save the task order
 */
export const TaskOrderStorage = (taskList: TaskList) => {
    const storageKey = getStorageKey(taskList);

    return {
        /**
         * Retrieves the task order from local storage.
         *
         * @returns The task order as an array of task IDs, or null if not found
         */
        get: () => localStorage.getItem(storageKey),

        /**
         * Saves the task order to local storage.
         *
         * @param orderedIds Array of task IDs in the desired order
         */
        save: (orderedIds: string[]) =>
            localStorage.setItem(storageKey, JSON.stringify(orderedIds)),
    };
};

const getStorageKey = (taskList: TaskList) => `task-order-${taskList.id}`;
