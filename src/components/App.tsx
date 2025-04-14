import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TaskList } from "@/data";
import { TaskLists } from "./TaskLists";
import { Button } from "./Button";
import { Tasks } from "./tasks/Tasks";
import { Spinner } from "./Spinner";
import { Palette } from "@/constants";
import { TaskApi } from "@/services";
import { AuthContext } from "@/contexts/auth";
import { useContext } from "@/hooks";
import { AuthProvider } from "@/providers";

const Container = styled.div`
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

const Header = styled.header`
    width: 100%;
    background-color: ${Palette.HeaderColor};
    border-bottom: 1px solid ${Palette.UtilityOrange};
    padding: 1rem 2rem;
    box-sizing: border-box;
`;

const HeaderContent = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 1.75rem;
    color: ${Palette.White};
`;

const MainContent = styled.main`
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

interface AuthContentProps {
    loading: boolean;
    selectedTaskList: TaskList | null;
    taskLists: TaskList[];
    setSelectedTaskList: Dispatch<SetStateAction<TaskList | null>>;
}

const AuthContent = ({
    loading,
    selectedTaskList,
    taskLists,
    setSelectedTaskList,
}: AuthContentProps) => (
    <>
        {loading && <Spinner />}
        {!loading && !selectedTaskList && (
            <TaskLists taskLists={taskLists} setSelectedTaskList={setSelectedTaskList} />
        )}
        {selectedTaskList && <Tasks taskList={selectedTaskList} />}
    </>
);

const AppContent = () => {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { isAuthenticated, login, signOut } = useContext(AuthContext);

    const reset = () => {
        setTaskLists([]);
        setSelectedTaskList(null);
        setLoading(false);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            reset();
            return;
        }

        console.debug("Fetching task lists...");

        setLoading(true);

        TaskApi.fetchTaskLists().then((taskLists) => {
            console.debug("Task lists fetched:", taskLists);
            setTaskLists(taskLists);
            setLoading(false);
        });
    }, [isAuthenticated]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <Title>Google Calendar Tasks Plus</Title>
                    {isAuthenticated && <Button onClick={signOut}>Sign Out</Button>}
                    {!isAuthenticated && <Button onClick={() => login()}>Sign in</Button>}
                </HeaderContent>
            </Header>

            <MainContent>
                {isAuthenticated && (
                    <AuthContent
                        loading={loading}
                        selectedTaskList={selectedTaskList}
                        taskLists={taskLists}
                        setSelectedTaskList={setSelectedTaskList}
                    />
                )}
            </MainContent>
        </Container>
    );
};

export const App = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT_ID}>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </GoogleOAuthProvider>
);
