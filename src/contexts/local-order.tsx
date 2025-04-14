import { Task, TaskList } from "@/data";
import { Auth, DnD, TaskApi, TaskOrderStorage } from "@/services";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from "react";

interface LocalOrderContextProps {
    swipeThreshold: number;
    taskList: TaskList;
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onRemove: (task: Task) => void;
    isOrderSynced: boolean;
    setOrderSynced: Dispatch<SetStateAction<boolean>>;
    listRef: React.RefObject<HTMLUListElement | null>;
    children: React.ReactNode;
}

export const LocalOrderContext = ({
    swipeThreshold,
    taskList,
    tasks,
    setTasks,
    setLoading,
    onRemove,
    isOrderSynced,
    setOrderSynced,
    listRef,
    children,
}: LocalOrderContextProps) => {
    const isAuthenticated = Auth.isAuthenticated();
    const sensors = useSensors(useSensor(PointerSensor));
    const storage = useMemo(() => new TaskOrderStorage(taskList), [taskList]);

    const loadOrder = useCallback(
        (tasks: Task[]) => {
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
        (ids: string[]) => {
            console.log("Saving order:", ids);
            storage.save(ids);
        },
        [storage],
    );

    const onTasksFetched = useCallback(
        (fetchedTasks: Task[]) => {
            console.debug("Tasks fetched:", fetchedTasks);
            loadOrder(fetchedTasks);
            setLoading(false);
        },
        [loadOrder, setLoading],
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (delta.x > swipeThreshold) {
            handleRemove(active.id as string);
            return;
        }

        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id);
            const newIndex = tasks.findIndex((t) => t.id === over?.id);
            const newTasks = arrayMove(tasks, oldIndex, newIndex);

            setTasks(newTasks);
            saveOrder(newTasks.map((t) => t.id));
        }
    };

    const handleRemove = (id: string) => {
        setTasks((prev: Task[]) => {
            const updated = prev.filter((task) => task.id !== id);
            saveOrder(updated.map((t) => t.id));
            onRemove(prev.find((task) => task.id === id) as Task);
            return updated;
        });
    };

    useEffect(() => {
        console.debug("Fetching tasks for list:", taskList);
        setLoading(true);
        TaskApi.fetchTasks(taskList).then(onTasksFetched);
    }, [isAuthenticated, taskList, onTasksFetched, setLoading]);

    useEffect(() => {
        if (!isOrderSynced) {
            saveOrder(tasks.map((t) => t.id));
            setOrderSynced(true);
        }
    }, [isOrderSynced, saveOrder, setOrderSynced, storage, tasks]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[DnD.restrictVerticalAndRight(listRef)]}
        >
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
};

const orderTasks = (savedOrder: string, fetchedTasks: Task[], orderedTasks: Task[]): Task[] => {
    try {
        const order = JSON.parse(savedOrder) as string[];
        const taskMap = new Map(fetchedTasks.map((task) => [task.id, task]));

        orderedTasks = order.map((id) => taskMap.get(id)).filter((t): t is Task => !!t);

        const missing = fetchedTasks.filter((t) => !order.includes(t.id));

        const rtn = [...orderedTasks, ...missing];

        console.debug("Ordered tasks:", rtn);

        return rtn;
    } catch (e) {
        console.warn("Failed to parse saved order:", e);
        return [];
    }
};
