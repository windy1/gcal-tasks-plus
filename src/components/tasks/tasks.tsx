import { Task, TaskList } from "@/data";
import { useRef, useState } from "react";
import styled from "styled-components";
import { TaskApi } from "@/services";
import { NewTaskInput, TaskItem } from ".";
import { SpinnerCenter } from "..";
import { LocalOrderContext } from "@/contexts";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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

interface TasksProps {
    taskList: TaskList;
}

export const Tasks: React.FC<TasksProps> = ({ taskList }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAddingTask, setAddingTask] = useState<boolean>(false);
    const [isOrderSynced, setOrderSynced] = useState<boolean>(true);
    const listRef = useRef<HTMLUListElement>(null);

    const onRemove = (task: Task) => TaskApi.completeTask(taskList, task);

    const onAdd = (task: Task) => {
        setTasks((prevTasks) => [task, ...prevTasks]);
        setOrderSynced(false);
    };

    return (
        <Container>
            <LocalOrderContext
                swipeThreshold={SwipeThreshold}
                taskList={taskList}
                tasks={tasks}
                setTasks={setTasks}
                setLoading={setLoading}
                onRemove={onRemove}
                isOrderSynced={isOrderSynced}
                setOrderSynced={setOrderSynced}
                listRef={listRef}
            >
                {!loading && (
                    <List ref={listRef}>
                        {isAddingTask && (
                            <NewTaskInput
                                isAddingTask={isAddingTask}
                                setAddingTask={setAddingTask}
                                onAdd={onAdd}
                                taskList={taskList}
                            />
                        )}
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                swipeThreshold={SwipeThreshold}
                                swipeOpacity={SwipeOpacity}
                            />
                        ))}
                    </List>
                )}

                {loading && <SpinnerCenter />}
            </LocalOrderContext>

            <StyledFab color="primary" onClick={() => setAddingTask(true)}>
                <AddIcon />
            </StyledFab>
        </Container>
    );
};
