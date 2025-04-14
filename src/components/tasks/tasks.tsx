import { Task, TaskList } from "@/data";
import { useRef, useState } from "react";
import styled from "styled-components";
import { TaskApi } from "@/services";
import { TaskItem } from ".";
import { Spinner } from "..";
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
    const listRef = useRef<HTMLUListElement>(null);

    const onRemove = (task: Task) => TaskApi.completeTask(taskList.id, task);

    const handleAddTask = () => {
        console.log("Add Task button clicked");
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
                listRef={listRef}
            >
                {!loading && (
                    <List ref={listRef}>
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

                {loading && <Spinner />}
            </LocalOrderContext>

            <StyledFab color="primary" onClick={handleAddTask}>
                <AddIcon />
            </StyledFab>
        </Container>
    );
};
