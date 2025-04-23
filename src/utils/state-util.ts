import { Task } from "@/data";
import { Dispatch, SetStateAction } from "react";

export const increment = (dispatch: Dispatch<SetStateAction<number>>) => () =>
    dispatch((prevCount) => prevCount + 1);

export const decrement = (dispatch: Dispatch<SetStateAction<number>>) => () =>
    dispatch((prevCount) => prevCount - 1);

export const useCounter = (dispatch: Dispatch<SetStateAction<number>>) => ({
    increment: increment(dispatch),
    decrement: decrement(dispatch),
});

export const updateLocalTask = (dispatch: Dispatch<SetStateAction<Task[]>>) => (task: Task) => {
    const action = (prevTasks: Task[]) =>
        prevTasks.map((prevTask) => (prevTask.id === task.id ? task : prevTask));
    return dispatch(action);
};
