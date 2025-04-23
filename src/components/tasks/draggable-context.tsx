import { Task } from "@/data";
import { Func, TaskId, WithChildren } from "@/types";
import { DnD } from "@/utils";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Dispatch, RefObject, SetStateAction } from "react";

interface DraggableContextProps extends WithChildren {
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    swipeThreshold: number;
    onRemove: Func<TaskId>;
    onOrderChange: Func<Task[]>;
    listRef: RefObject<HTMLUListElement | null>;
}

export const DraggableContext = ({
    tasks,
    setTasks,
    swipeThreshold,
    onRemove,
    onOrderChange,
    listRef,
    children,
}: DraggableContextProps) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (delta.x > swipeThreshold) {
            onRemove(active.id as string);
            return;
        }

        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id);
            const newIndex = tasks.findIndex((t) => t.id === over?.id);
            const newTasks = arrayMove(tasks, oldIndex, newIndex);

            setTasks(newTasks);
            onOrderChange(newTasks);
        }
    };

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
