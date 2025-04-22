import { Task, TaskList } from "@/data";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import styled from "styled-components";
import { TaskApi } from "@/services";
import { LocalOrderContext, NewTaskInput, TaskItem } from ".";
import { SpinnerCenter } from "..";
import { CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskTitle } from "@/types";
import { StateUtil } from "@/utils";

const SwipeThreshold = 600;
const SwipeOpacity = 0.5;
const FabColor = "primary";

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
    const [isLoading, setLoading] = useState<boolean>(false);
    const [backgroundTaskCount, setBackgroundTaskCount] = useState<number>(0);
    const [isOrderSynced, setOrderSynced] = useState<boolean>(true);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const isBackgroundBusy = backgroundTaskCount > 0;
    const incrementBackgroundTaskCount = StateUtil.increment(setBackgroundTaskCount);
    const decrementBackgroundTaskCount = StateUtil.decrement(setBackgroundTaskCount);

    const handleRemove = (task: Task) => {
        incrementBackgroundTaskCount();
        TaskApi.completeTask(taskList, task).then(decrementBackgroundTaskCount);
    };

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
                {!isLoading && (
                    <TaskContent
                        listRef={listRef}
                        taskList={taskList}
                        tasks={tasks}
                        setTasks={setTasks}
                        setOrderSynced={setOrderSynced}
                        setBackgroundTaskCount={setBackgroundTaskCount}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                    />
                )}

                {isLoading && <SpinnerCenter />}
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
    setBackgroundTaskCount: Dispatch<SetStateAction<number>>;
    editingTaskId: string | null;
    setEditingTaskId: Dispatch<SetStateAction<string | null>>;
}

const TaskContent = ({
    listRef,
    taskList,
    tasks,
    setTasks,
    setOrderSynced,
    setBackgroundTaskCount,
    editingTaskId,
    setEditingTaskId,
}: TaskContentProps) => {
    const [isAddingTask, setAddingTask] = useState<boolean>(false);
    const decrementBackgroundTaskCount = StateUtil.decrement(setBackgroundTaskCount);

    const handleAdd = (task: Task) => {
        setTasks((prevTasks) => [task, ...prevTasks]);
        setOrderSynced(false);
    };

    const updateTask = (task: Task) => {
        const mapTasks = (prevTasks: Task[]) =>
            prevTasks.map((prevTask) => (prevTask.id === task.id ? task : prevTask));
        setTasks(mapTasks);
    };

    const handleEdit = (newTitle: TaskTitle) => {
        const task = tasks.find((task) => task.id === editingTaskId);

        if (!task) {
            return;
        }

        const updatedTask = { ...task, title: newTitle };

        updateTask(updatedTask);

        TaskApi.updateTask(taskList, updatedTask).then(() => {
            updateTask(updatedTask);
            decrementBackgroundTaskCount();
        });

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
                        setBackgroundTaskCount={setBackgroundTaskCount}
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
            <AddButton setAddingTask={setAddingTask} />
        </>
    );
};

interface AddButtonProps {
    setAddingTask: Dispatch<SetStateAction<boolean>>;
}

const AddButton = ({ setAddingTask }: AddButtonProps) => (
    <StyledFab color={FabColor} onClick={() => setAddingTask(true)}>
        <AddIcon />
    </StyledFab>
);
