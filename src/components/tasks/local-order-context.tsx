import { Task, TaskList } from "@/data";
import { TaskOrderStorage } from "@/services";
import {
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { Func, SaveState, TaskId, WithChildren } from "@/types";
import { DraggableContext } from "./draggable-context";

interface LocalOrderContextProps extends WithChildren {
    taskList: TaskList;
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    saveState: SaveState;
    setSaveState: Dispatch<SetStateAction<SaveState>>;
    onRemove: Func<TaskId>;
    swipeThreshold: number;
    listRef: RefObject<HTMLUListElement | null>;
}

export const LocalOrderContext = ({
    taskList,
    tasks,
    setTasks,
    saveState,
    setSaveState,
    onRemove,
    swipeThreshold,
    listRef,
    children,
}: LocalOrderContextProps) => {
    const storage = useMemo(() => TaskOrderStorage(taskList), [taskList]);
    const loadingRef = useRef(false);

    const loadOrder = useCallback(
        (tasks: Task[]) => {
            console.debug("Loading order:", tasks);
            const savedOrder = storage.get();
            let orderedTasks = tasks;

            if (savedOrder) {
                orderedTasks = orderTasks(savedOrder, tasks, orderedTasks);
            }

            setTasks(orderedTasks);
        },
        [setTasks, storage],
    );

    const saveOrder = useCallback(
        (tasks: Task[]) => {
            console.debug("Saving order:", tasks);
            storage.save(tasks.map((t) => t.id));
        },
        [storage],
    );

    useEffect(() => {
        if (saveState === SaveState.NotReady) return;

        if (saveState === SaveState.Unloaded && !loadingRef.current) {
            // use a ref here to prevent flickering in strict-mode with double render
            loadingRef.current = true;
            setSaveState(SaveState.Saved);
            loadOrder(tasks);
            loadingRef.current = false;
            return;
        }

        if (saveState === SaveState.NotSaved) {
            setSaveState(SaveState.Saved);
            saveOrder(tasks);
            return;
        }
    }, [loadOrder, saveOrder, saveState, setSaveState, tasks]);

    return (
        <DraggableContext
            tasks={tasks}
            setTasks={setTasks}
            swipeThreshold={swipeThreshold}
            onRemove={onRemove}
            onOrderChange={saveOrder}
            listRef={listRef}
        >
            {children}
        </DraggableContext>
    );
};

const orderTasks = (savedOrder: string, fetchedTasks: Task[], orderedTasks: Task[]): Task[] => {
    try {
        const order = JSON.parse(savedOrder) as string[];
        const taskMap = new Map(fetchedTasks.map((task) => [task.id, task]));

        console.debug("Saved order: ", order);

        orderedTasks = order.map((id) => taskMap.get(id)).filter((t): t is Task => !!t);

        const missing = fetchedTasks.filter((t) => !order.includes(t.id));

        return [...orderedTasks, ...missing];
    } catch (e) {
        console.warn("Failed to parse saved order:", e);
        return [];
    }
};
