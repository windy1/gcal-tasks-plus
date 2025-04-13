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
import { useEffect, useState } from "react";
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

const restrictVerticalAndRight: Modifier = ({ transform, draggingNodeRect, windowRect }) => {
    const maxY = (windowRect?.height ?? 0) - (draggingNodeRect?.height ?? 0);

    const restrictY = transform.x > VerticalAxisLockThreshold;

    return {
        ...transform,
        x: Math.max(0, transform.x),
        y: restrictY ? 0 : Math.min(Math.max(0, transform.y), maxY),
    };
};

interface TasksProps {
    taskList: TaskList;
}

export const Tasks: React.FC<TasksProps> = ({ taskList }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const token = localStorage.getItem(Auth.AccessToken);

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
                modifiers={[restrictVerticalAndRight]}
            >
                {!loading && (
                    <SortableContext
                        items={tasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <List>
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
