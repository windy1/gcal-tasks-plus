import { Action, Func } from "@/types";
import { createContext } from "react";

interface BackgroundTasksContextType {
    runInBackground: Func<Action<Promise<unknown>>>;
    isBackgroundBusy: boolean;
}

export const BackgroundTasksContext = createContext<BackgroundTasksContextType | undefined>(
    undefined,
);
