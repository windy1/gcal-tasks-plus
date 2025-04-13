import { Auth, Pallette } from "@/constants";
import { Task, TaskList } from "@/data";
import { fetchTasks } from "@/hooks/fetch-tasks";
import { Grip } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    width: 100%;
    max-width: 1000px; // adjust as needed
`;

const Item = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${Pallette.UtilityOrange};
    border: 1px solid ${Pallette.Black};
    color: ${Pallette.Black};
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    transition: background-color 0.5s ease;
    cursor: pointer;
    margin: 0;
    border-radius: 0;
    font-weight: 650;

    &:hover {
        background-color: ${Pallette.UtilityOrangeDark};
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

interface TasksProps {
    taskList: TaskList;
}

export const Tasks: React.FC<TasksProps> = ({ taskList }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const token = localStorage.getItem(Auth.AccessToken);

    if (!token) {
        throw new Error("No token found");
    }

    useEffect(() => {
        fetchTasks(token, taskList, setTasks);
    }, [token, taskList]);

    return (
        <Container>
            <List>
                {tasks.map((task) => (
                    <Item key={task.id}>
                        <Left>
                            <Grip size={20} />
                            <span>{task.title}</span>
                        </Left>
                    </Item>
                ))}
            </List>
        </Container>
    );
};
