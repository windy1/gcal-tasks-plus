import { TaskList } from "@/data";
import React from "react";
import styled from "styled-components";
import { Pallette } from "@/constants";

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
    max-width: 800px;
`;

const Item = styled.li`
    width: 100%;
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    line-height: 1.6;
    border-bottom: 1px solid ${Pallette.White};
    transition: background-color 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: ${Pallette.BackgroundColorDark};
    }

    &:last-child {
        border-bottom: none;
    }
`;

interface TaskListsProps {
    taskLists: TaskList[];
    setSelectedTaskList: (taskList: TaskList) => void;
}

export const TaskLists: React.FC<TaskListsProps> = ({ taskLists, setSelectedTaskList }) => {
    return (
        <Container>
            <List>
                {taskLists.map((list) => (
                    <Item key={list.id} onClick={() => setSelectedTaskList(list)}>
                        {list.title}
                    </Item>
                ))}
            </List>
        </Container>
    );
};
