import { Auth } from "@/constants";
import { Task, TaskList } from "@/data";
import { fetchTasks } from "@/hooks/fetch-tasks";
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
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SortableItem } from "./SortableItem";
import { Spinner } from "../Spinner";

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

interface TasksProps {
    taskList: TaskList;
}

export const Tasks: React.FC<TasksProps> = ({ taskList }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const token = localStorage.getItem(Auth.AccessToken);
    const listRef = useRef<HTMLUListElement>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        setLoading(true);

        fetchTasks(token, taskList, (tasks) => {
            setTasks(tasks);
            setLoading(false);
        });
    }, [token, taskList]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (delta.x > SwipeThreshold) {
            handleRemove(active.id as string);
            return;
        }

        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id);
            const newIndex = tasks.findIndex((t) => t.id === over?.id);
            setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
        }
    };

    const handleRemove = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
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
                                <SortableItem
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
