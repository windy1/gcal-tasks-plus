import { Task, TaskList } from "@/data";
import {
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { AuthStorage, TaskApi } from "@/services";
import { LocalOrderContext, NewTaskInput, TaskItem } from ".";
import { SpinnerCenter } from "..";
import { CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SaveState, TaskId, TaskTitle } from "@/types";
import { StateUtil } from "@/utils";
import { useContext } from "@/hooks";
import { AuthContext } from "@/contexts";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/constants";

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
    const [saveState, setSaveState] = useState<SaveState>(SaveState.NotReady);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const { signOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const listRef = useRef<HTMLUListElement>(null);
    const isBackgroundBusy = backgroundTaskCount > 0;

    const { increment: incrementBackgroundTaskCount, decrement: decrementBackgroundTaskCount } =
        StateUtil.useCounter(setBackgroundTaskCount);

    const handleRemove = (id: TaskId) => {
        setTasks((prev: Task[]) => {
            const removed = prev.find((task) => task.id === id);
            const newState = prev.filter((task) => task.id !== id);

            if (!removed) return newState;

            incrementBackgroundTaskCount();

            TaskApi.completeTask(taskList, removed).then((completedTask) => {
                if (!completedTask) return;
                setSaveState(SaveState.NotSaved);
                decrementBackgroundTaskCount();
            });

            return newState;
        });
    };

    const handleTasksFetched = useCallback((tasks: Task[]) => {
        console.debug("Tasks fetched:", tasks);
        setSaveState(SaveState.Unloaded);
        setTasks(tasks);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!AuthStorage.checkToken()) {
            signOut();
            navigate(AppRoutes.TaskLists());
            return;
        }

        console.debug("Fetching tasks for list:", taskList);
        setLoading(true);
        TaskApi.fetchTasks(taskList).then(handleTasksFetched);
    }, [taskList, handleTasksFetched, setLoading, navigate, signOut]);

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
                saveState={saveState}
                setSaveState={setSaveState}
                onRemove={handleRemove}
                listRef={listRef}
            >
                {!isLoading && (
                    <TaskContent
                        listRef={listRef}
                        taskList={taskList}
                        tasks={tasks}
                        setTasks={setTasks}
                        setBackgroundTaskCount={setBackgroundTaskCount}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                        setSaveState={setSaveState}
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
    setBackgroundTaskCount: Dispatch<SetStateAction<number>>;
    editingTaskId: string | null;
    setEditingTaskId: Dispatch<SetStateAction<string | null>>;
    setSaveState: Dispatch<SetStateAction<SaveState>>;
}

const TaskContent = ({
    listRef,
    taskList,
    tasks,
    setTasks,
    setBackgroundTaskCount,
    editingTaskId,
    setEditingTaskId,
    setSaveState,
}: TaskContentProps) => {
    const [isAddingTask, setAddingTask] = useState<boolean>(false);
    const decrementBackgroundTaskCount = StateUtil.decrement(setBackgroundTaskCount);
    const updateLocalTask = StateUtil.updateLocalTask(setTasks);

    const handleAdd = (task: Task) => {
        setTasks((prevTasks) => [task, ...prevTasks]);
        setSaveState(SaveState.NotSaved);
    };

    const handleEdit = (newTitle: TaskTitle) => {
        const task = tasks.find((task) => task.id === editingTaskId);

        if (!task) {
            return;
        }

        const updatedTask = { ...task, title: newTitle };

        updateLocalTask(updatedTask);

        TaskApi.updateTask(taskList, updatedTask).then(() => {
            updateLocalTask(updatedTask);
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
