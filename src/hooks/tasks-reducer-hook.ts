import { tasksReducer, TasksReducerState } from "@/reducers";
import { SaveState } from "@/types";
import { useReducer } from "react";

const initialState: TasksReducerState = {
    tasks: [],
    isLoading: false,
    backgroundTaskCount: 0,
    saveState: SaveState.NotReady,
    editingTaskId: null,
};

export const useTasksReducer = () => useReducer(tasksReducer, initialState);
