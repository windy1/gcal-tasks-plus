import { Palette } from "@/constants";
import { IconButton, TextField } from "@mui/material";
import { useEffect, useRef, useState, KeyboardEvent, Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { TaskApi } from "@/services";
import { NewCreateTaskPayload, Task, TaskList } from "@/data";

const Enter = "Enter";

const InputRow = styled.li`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

interface NewTaskInputProps {
    isAddingTask: boolean;
    setAddingTask: Dispatch<SetStateAction<boolean>>;
    onAdd: (task: Task) => void;
    setBackgroundTaskCount: Dispatch<SetStateAction<number>>;
    taskList: TaskList;
}

export const NewTaskInput = ({
    isAddingTask,
    setAddingTask,
    onAdd,
    setBackgroundTaskCount,
    taskList,
}: NewTaskInputProps) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");
    const newTaskInputRef = useRef<HTMLInputElement>(null);

    const handleCancelAdd = () => {
        setAddingTask(false);
        setNewTaskTitle("");
    };

    const handleTaskCreated = (task: Task | null) => {
        setBackgroundTaskCount((prevCount) => prevCount - 1);

        if (!task) {
            return;
        }

        console.debug("Task created:", task);
        onAdd(task);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === Enter) {
            e.preventDefault();

            if (newTaskTitle.trim()) {
                console.debug("New task:", newTaskTitle);
                const newTask = NewCreateTaskPayload(newTaskTitle);
                setNewTaskTitle("");
                setAddingTask(false);
                setBackgroundTaskCount((prevCount) => prevCount + 1);
                TaskApi.createTask(taskList, newTask).then(handleTaskCreated);
            }
        }
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
                onKeyDown={handleKeyDown}
                color="primary"
                sx={{ input: { color: Palette.White } }}
            />
            <IconButton onClick={handleCancelAdd}>
                <CloseIcon sx={{ color: Palette.White }} />
            </IconButton>
        </InputRow>
    );
};
