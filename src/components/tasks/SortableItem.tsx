import { CSS } from "@dnd-kit/utilities";
import { Palette } from "@/constants";
import { Task } from "@/data";
import { useSortable } from "@dnd-kit/sortable";
import styled from "styled-components";
import { Grip } from "lucide-react";

const ItemWrapper = styled.li<{ isDragging: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${Palette.UtilityOrange};
    border: 1px solid ${Palette.Black};
    color: ${Palette.Black};
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    transition: background-color 0.2s ease;
    cursor: grab;
    font-weight: 650;
    margin: 0;
    border-radius: 0;

    &:hover {
        background-color: ${Palette.UtilityOrangeDark};
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const GripSize = 20;

interface SortableItemProps {
    task: Task;
    swipeThreshold: number;
    swipeOpacity: number;
}

export const SortableItem: React.FC<SortableItemProps> = ({
    task,
    swipeThreshold,
    swipeOpacity,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
    });

    const opacity = transform?.x && transform.x > swipeThreshold ? swipeOpacity : 1;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity,
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
                <Grip size={GripSize} />
                <span>{task.title}</span>
            </Left>
        </ItemWrapper>
    );
};
