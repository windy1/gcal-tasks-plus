import { Auth, Pallette } from "@/constants";
import { Task, TaskList } from "@/data";
import { fetchTasks } from "@/hooks/fetch-tasks";
import { Grip } from "lucide-react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { restrictToParentElement } from "@dnd-kit/modifiers";

// ---------- styled components ----------

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

const ItemWrapper = styled.li<{ isDragging: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${Pallette.UtilityOrange};
    border: 1px solid ${Pallette.Black};
    color: ${Pallette.Black};
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    transition: background-color 0.2s ease;
    cursor: grab;
    font-weight: 650;
    margin: 0;
    border-radius: 0;
    opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
    &:hover {
        background-color: ${Pallette.UtilityOrangeDark};
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const SortableItem: React.FC<{ task: Task }> = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <ItemWrapper
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            isDragging={isDragging}
        >
            <Left>
                <Grip size={20} />
                <span>{task.title}</span>
            </Left>
        </ItemWrapper>
    );
};

interface TasksProps {
    taskList: TaskList;
}

export const Tasks: React.FC<TasksProps> = ({ taskList }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const token = localStorage.getItem(Auth.AccessToken);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        fetchTasks(token!, taskList, setTasks);
    }, [token, taskList]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id);
            const newIndex = tasks.findIndex((t) => t.id === over?.id);
            setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
        }
    };

    return (
        <Container>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
            >
                <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <List>
                        {tasks.map((task) => (
                            <SortableItem key={task.id} task={task} />
                        ))}
                    </List>
                </SortableContext>
            </DndContext>
        </Container>
    );
};
