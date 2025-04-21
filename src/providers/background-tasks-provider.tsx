import { BackgroundTasksContext } from "@/contexts/background-tasks-context";
import { useState } from "react";

interface BackgroundTaskProviderProps {
    children: React.ReactNode;
}

export const BackgroundTasksProvider = ({ children }: BackgroundTaskProviderProps) => {
    const [backgroundTaskCount, setBackgroundTaskCount] = useState<number>(0);

    const incrementBackgroundTaskCount = () => setBackgroundTaskCount((prevCount) => prevCount + 1);

    const decrementBackgroundTaskCount = () => setBackgroundTaskCount((prevCount) => prevCount - 1);

    const runInBackground = async (task: () => Promise<unknown>) => {
        incrementBackgroundTaskCount();

        try {
            return await task();
        } finally {
            decrementBackgroundTaskCount();
        }
    };

    const isBackgroundBusy = backgroundTaskCount > 0;

    return (
        <BackgroundTasksContext.Provider
            value={{
                runInBackground,
                isBackgroundBusy,
            }}
        >
            {children}
        </BackgroundTasksContext.Provider>
    );
};
