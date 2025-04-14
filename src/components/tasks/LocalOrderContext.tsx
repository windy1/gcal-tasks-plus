import { Task, TaskList } from "@/data";
import { Auth, DnD, TaskApi } from "@/services";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

const TaskOrderStorageKey = (taskList: TaskList) => `task-order-${taskList.id}`;

interface LocalOrderContextProps {
    swipeThreshold: number;
    taskList: TaskList;
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    listRef: React.RefObject<HTMLUListElement | null>;
    children: React.ReactNode;
}

export const LocalOrderContext = ({
    swipeThreshold,
    taskList,
    tasks,
    setTasks,
    setLoading,
    listRef,
    children,
}: LocalOrderContextProps) => {
    const isAuthenticated = Auth.isAuthenticated();
    const sensors = useSensors(useSensor(PointerSensor));
    const taskOrderStorageKey = TaskOrderStorageKey(taskList);

    const onTasksFetched = useCallback(
        (fetchedTasks: Task[]) => {
            console.debug("Tasks fetched:", fetchedTasks);

            const savedOrder = localStorage.getItem(taskOrderStorageKey);
            let orderedTasks = fetchedTasks;

            if (savedOrder) {
                orderedTasks = orderTasks(savedOrder, fetchedTasks, orderedTasks);
            }

            setTasks(orderedTasks);
            setLoading(false);
        },
        [setLoading, setTasks, taskOrderStorageKey],
    );

    const saveOrder = (orderedIds: string[]) => {
        localStorage.setItem(taskOrderStorageKey, JSON.stringify(orderedIds));
    };

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
            return updated;
        });
    };

    useEffect(() => {
        console.debug("Fetching tasks for list:", taskList);
        setLoading(true);
        TaskApi.fetchTasks(taskList).then(onTasksFetched);
    }, [isAuthenticated, taskList, onTasksFetched, setLoading]);

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

        return [...orderedTasks, ...missing];
    } catch (e) {
        console.warn("Failed to parse saved order:", e);
        return [];
    }
};
