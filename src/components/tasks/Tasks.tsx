import { Task, TaskList } from "@/data";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    Modifier,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TaskItem } from "./TaskItem";
import { Spinner } from "../Spinner";
import { Auth, TaskApi } from "@/services";

const SwipeThreshold = 600;
const SwipeOpacity = 0.5;
const VerticalAxisLockThreshold = 100;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    width: 100%;
    max-width: 1000px;
`;

const restrictVerticalAndRight = (listRef: React.RefObject<HTMLElement | null>): Modifier => {
    return ({ transform, draggingNodeRect }) => {
        const listRect = listRef.current?.getBoundingClientRect();

        if (!listRect || !draggingNodeRect) return transform;

        const minY = listRect.top - draggingNodeRect.top;
        const maxY = listRect.bottom - draggingNodeRect.bottom;

        const lockVertical =
            Math.abs(transform.x) > VerticalAxisLockThreshold &&
            Math.abs(transform.x) > Math.abs(transform.y);

        return {
            ...transform,
            x: Math.max(0, transform.x),
            y: lockVertical ? 0 : Math.max(minY, Math.min(transform.y, maxY)),
        };
    };
};

const TaskOrderStorageKey = (taskList: TaskList) => `task-order-${taskList.id}`;

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

interface TasksProps {
    taskList: TaskList;
}

export const Tasks: React.FC<TasksProps> = ({ taskList }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const token = Auth.getToken();
    const listRef = useRef<HTMLUListElement>(null);
    const taskOrderStorageKey = TaskOrderStorageKey(taskList);

    const sensors = useSensors(useSensor(PointerSensor));

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
        [taskOrderStorageKey],
    );

    useEffect(() => {
        console.debug("Fetching tasks for list:", taskList);
        setLoading(true);
        TaskApi.fetchTasks(taskList).then(onTasksFetched);
    }, [token, taskList, taskOrderStorageKey, onTasksFetched]);

    const saveOrder = (orderedIds: string[]) => {
        localStorage.setItem(taskOrderStorageKey, JSON.stringify(orderedIds));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (delta.x > SwipeThreshold) {
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
        setTasks((prev) => {
            const updated = prev.filter((task) => task.id !== id);
            saveOrder(updated.map((t) => t.id));
            return updated;
        });
    };

    return (
        <Container>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictVerticalAndRight(listRef)]}
            >
                {!loading && (
                    <SortableContext
                        items={tasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <List ref={listRef}>
                            {tasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    swipeThreshold={SwipeThreshold}
                                    swipeOpacity={SwipeOpacity}
                                />
                            ))}
                        </List>
                    </SortableContext>
                )}

                {loading && <Spinner />}
            </DndContext>
        </Container>
    );
};
