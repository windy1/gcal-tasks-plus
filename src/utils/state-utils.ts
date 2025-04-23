import { Task } from "@/data";
import { Dispatch, SetStateAction } from "react";

/**
 * Returns an object with increment and decrement functions for a counter using the provided dispatch function.
 *
 * @param dispatch - The dispatch function to update the counter state.
 * @returns An object containing increment and decrement functions.
 */
export const useCounter = (dispatch: Dispatch<SetStateAction<number>>) => ({
    increment: increment(dispatch),
    decrement: decrement(dispatch),
});

/**
 * Updates the local task state by replacing the task with the provided one.
 *
 * @param dispatch - The dispatch function to update the task state.
 * @returns A function that takes a task and updates the state.
 */
export const updateLocalTask = (dispatch: Dispatch<SetStateAction<Task[]>>) => (task: Task) => {
    const action = (prevTasks: Task[]) =>
        prevTasks.map((prevTask) => (prevTask.id === task.id ? task : prevTask));
    return dispatch(action);
};

const increment = (dispatch: Dispatch<SetStateAction<number>>) => () =>
    dispatch((prevCount) => prevCount + 1);

const decrement = (dispatch: Dispatch<SetStateAction<number>>) => () =>
    dispatch((prevCount) => prevCount - 1);
