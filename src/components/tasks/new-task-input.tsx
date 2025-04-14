import { Palette } from "@/constants";
import { IconButton, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";

const InputRow = styled.li`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

interface NewTaskInputProps {
    isAddingTask: boolean;
    setAddingTask: (isAdding: boolean) => void;
}

export const NewTaskInput = ({ isAddingTask, setAddingTask }: NewTaskInputProps) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");
    const newTaskInputRef = useRef<HTMLInputElement>(null);

    const handleCancelAdd = () => {
        setAddingTask(false);
        setNewTaskTitle("");
    };

    useEffect(() => {
        if (isAddingTask && newTaskInputRef.current) {
            newTaskInputRef.current.focus();
        }
    }, [isAddingTask]);

    return (
        <InputRow>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="New task title"
                inputRef={newTaskInputRef}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                color="primary"
                sx={{ input: { color: Palette.White } }}
            />
            <IconButton onClick={handleCancelAdd}>
                <CloseIcon sx={{ color: Palette.White }} />
            </IconButton>
        </InputRow>
    );
};
