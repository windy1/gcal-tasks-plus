import { Task, TaskList } from "@/data";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import styled from "styled-components";
import { TaskApi } from "@/services";
import { LocalOrderContext, NewTaskInput, TaskItem } from ".";
import { SpinnerCenter } from "..";
import { CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskTitle } from "@/types";
import { BackgroundTasksContext } from "@/contexts";
import { useContext } from "@/hooks";

const SwipeThreshold = 600;
const SwipeOpacity = 0.5;

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    width: 100%;
    max-width: 1000px;
`;

const StyledFab = styled(Fab)`
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
`;

const SpinnerTopLeft = styled.div`
    position: fixed;
    top: 6rem;
    left: 1rem;
    z-index: 1000;
`;

interface TasksProps {
    taskList: TaskList;
}

export const Tasks = ({ taskList }: TasksProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOrderSynced, setOrderSynced] = useState<boolean>(true);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const { runInBackground, isBackgroundBusy } = useContext(BackgroundTasksContext);
    const listRef = useRef<HTMLUListElement>(null);

    const handleRemove = (task: Task) =>
        runInBackground(() => TaskApi.completeTask(taskList, task));

    return (
        <Container>
            {isBackgroundBusy && (
                <SpinnerTopLeft>
                    <CircularProgress />
                </SpinnerTopLeft>
            )}

            <LocalOrderContext
                swipeThreshold={SwipeThreshold}
                taskList={taskList}
                tasks={tasks}
                setTasks={setTasks}
                setLoading={setLoading}
                onRemove={handleRemove}
                isOrderSynced={isOrderSynced}
                setOrderSynced={setOrderSynced}
                listRef={listRef}
            >
                {!loading && (
                    <TaskContent
                        listRef={listRef}
                        taskList={taskList}
                        tasks={tasks}
                        setTasks={setTasks}
                        setOrderSynced={setOrderSynced}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                    />
                )}

                {loading && <SpinnerCenter />}
            </LocalOrderContext>
        </Container>
    );
};

interface TaskContentProps {
    listRef: RefObject<HTMLUListElement | null>;
    taskList: TaskList;
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    setOrderSynced: Dispatch<SetStateAction<boolean>>;
    editingTaskId: string | null;
    setEditingTaskId: Dispatch<SetStateAction<string | null>>;
}

const TaskContent = ({
    listRef,
    taskList,
    tasks,
    setTasks,
    setOrderSynced,
    editingTaskId,
    setEditingTaskId,
}: TaskContentProps) => {
    const [isAddingTask, setAddingTask] = useState<boolean>(false);
    const { runInBackground } = useContext(BackgroundTasksContext);

    const handleAdd = (task: Task) => {
        setTasks((prevTasks) => [task, ...prevTasks]);
        setOrderSynced(false);
    };

    const updateTask = (task: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map((prevTask) => (prevTask.id === task.id ? task : prevTask)),
        );
    };

    const handleEdit = (newTitle: TaskTitle) => {
        const task = tasks.find((task) => task.id === editingTaskId);

        if (!task) {
            return;
        }

        const updatedTask = { ...task, title: newTitle };

        updateTask(updatedTask);
        runInBackground(() => TaskApi.updateTask(taskList, updatedTask));
        setEditingTaskId(null);
    };

    return (
        <>
            <List ref={listRef}>
                {isAddingTask && (
                    <NewTaskInput
                        isAddingTask={isAddingTask}
                        setAddingTask={setAddingTask}
                        onAdd={handleAdd}
                        taskList={taskList}
                    />
                )}
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        swipeThreshold={SwipeThreshold}
                        swipeOpacity={SwipeOpacity}
                        onEdit={() => setEditingTaskId(task.id)}
                        onEditCancel={() => setEditingTaskId(null)}
                        onEditSubmit={handleEdit}
                        isEditing={editingTaskId === task.id}
                    />
                ))}
            </List>
            <StyledFab color="primary" onClick={() => setAddingTask(true)}>
                <AddIcon />
            </StyledFab>
        </>
    );
};
