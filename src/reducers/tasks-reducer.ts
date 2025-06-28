import { Task } from "@/data";
import { SaveState } from "@/types";

export interface TasksReducerState {
    tasks: Task[];
    isLoading: boolean;
    backgroundTaskCount: number;
    saveState: SaveState;
    editingTaskId: string | null;
}

export const SetTasks = "tasks.setTasks";
export const PutTask = "tasks.putTask";
export const SetLoading = "tasks.setLoading";
export const IncrementBackgroundTaskCount = "tasks.incrementBackgroundTaskCount";
export const DecrementBackgroundTaskCount = "tasks.decrementBackgroundTaskCount";
export const SetSaveState = "tasks.setSaveState";
export const SetEditingTaskId = "tasks.setEditingTaskId";

type Action =
    | { type: typeof SetTasks; payload: Task[] }
    | { type: typeof PutTask; payload: Task }
    | { type: typeof SetLoading; payload: boolean }
    | { type: typeof IncrementBackgroundTaskCount }
    | { type: typeof DecrementBackgroundTaskCount }
    | { type: typeof SetSaveState; payload: SaveState }
    | { type: typeof SetEditingTaskId; payload: string | null };

export const tasksReducer = (state: TasksReducerState, action: Action): TasksReducerState => {
    switch (action.type) {
        case SetTasks:
            return { ...state, tasks: action.payload };
        case PutTask: {
            const updatedTasks = state.tasks.map((task) =>
                task.id === action.payload.id ? { ...task, ...action.payload } : task,
            );
            return { ...state, tasks: updatedTasks };
        }
        case SetLoading:
            return { ...state, isLoading: action.payload };
        case IncrementBackgroundTaskCount:
            return { ...state, backgroundTaskCount: state.backgroundTaskCount + 1 };
        case DecrementBackgroundTaskCount:
            return { ...state, backgroundTaskCount: state.backgroundTaskCount - 1 };
        case SetSaveState:
            return { ...state, saveState: action.payload };
        case SetEditingTaskId:
            return { ...state, editingTaskId: action.payload };
        default:
            return state;
    }
};
