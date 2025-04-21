import { CSS } from "@dnd-kit/utilities";
import { Keyboard, Palette } from "@/constants";
import { Task } from "@/data";
import { useSortable } from "@dnd-kit/sortable";
import styled from "styled-components";
import { Grip, Pencil } from "lucide-react";
import { Action, Func, TaskTitle } from "@/types";
import { useState } from "react";
import { TextField } from "../input";

const GripSize = 20;
const PencilSize = 18;

const ItemWrapper = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${Palette.UtilityOrange};
    border: 1px solid ${Palette.Black};
    color: ${Palette.Black};
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    font-weight: 650;
    border-radius: 0;
    transition: background-color 0.2s ease;
    will-change: transform;
    margin-block: 0.25rem;

    &:hover {
        background-color: ${Palette.UtilityOrangeDark};
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
`;

const Right = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    transition:
        transform 0.2s ease,
        color 0.2s ease;

    svg {
        color: ${Palette.Black};
        transition:
            transform 0.2s ease,
            color 0.2s ease;
    }

    &:hover svg {
        transform: scale(1.15);
        color: ${Palette.IconColorDark};
    }
`;

const GripWrapper = styled.div`
    cursor: grab;
    line-height: 0;
`;

interface TaskItemProps {
    task: Task;
    swipeThreshold: number;
    swipeOpacity: number;
    onEdit: Func<Task>;
    onEditCancel: Action;
    onEditSubmit: Func<TaskTitle>;
    isEditing: boolean;
}

export const TaskItem = ({
    task,
    swipeThreshold,
    swipeOpacity,
    onEdit,
    onEditCancel,
    onEditSubmit,
    isEditing,
}: TaskItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task.id,
    });

    const opacity = transform?.x && transform.x > swipeThreshold ? swipeOpacity : 1;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity,
    };

    const [editedTitle, setEditedTitle] = useState(task.title);

    const handleEditKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === Keyboard.Enter) {
            onEditSubmit(editedTitle);
        }
    };

    return (
        <ItemWrapper ref={setNodeRef} style={style} {...attributes}>
            <Left>
                <GripWrapper {...listeners}>
                    <Grip size={GripSize} />
                </GripWrapper>
                {isEditing ? (
                    <TextField
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={() => onEditCancel()}
                        onKeyDown={handleEditKeyDown}
                        textColor={Palette.Black}
                        backgroundColor={Palette.White}
                        autoFocus
                    />
                ) : (
                    <span>{task.title}</span>
                )}
            </Left>
            {!isEditing && (
                <Right onClick={() => onEdit(task)}>
                    <Pencil size={PencilSize} />
                </Right>
            )}
        </ItemWrapper>
    );
};
