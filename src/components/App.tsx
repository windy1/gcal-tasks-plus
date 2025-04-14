import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useGoogleLoginWithStorage } from "@/hooks";
import { TaskList } from "@/data";
import { TaskLists } from "./TaskLists";
import { Button } from "./Button";
import { Tasks } from "./tasks/Tasks";
import { Spinner } from "./Spinner";
import { Palette } from "@/constants";
import { Auth, TaskApi } from "@/services";

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

const AppContent = () => {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const token = Auth.getToken();

    const login = useGoogleLoginWithStorage();

    const signOut = () => {
        Auth.clearToken();
        setTaskLists([]);
    };

    useEffect(() => {
        Auth.checkToken();
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }

        console.debug("Fetching task lists...");

        setLoading(true);

        TaskApi.fetchTaskLists().then((taskLists) => {
            console.debug("Task lists fetched:", taskLists);
            setTaskLists(taskLists);
            setLoading(false);
        });
    }, [token]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <Title>Google Calendar Tasks Plus</Title>
                    {token && <Button onClick={signOut}>Sign Out</Button>}
                    {!token && <Button onClick={() => login()}>Sign in</Button>}
                </HeaderContent>
            </Header>

            <MainContent>
                {token && loading && <Spinner />}

                {token && !loading && !selectedTaskList && (
                    <TaskLists taskLists={taskLists} setSelectedTaskList={setSelectedTaskList} />
                )}

                {token && selectedTaskList && <Tasks taskList={selectedTaskList} />}
            </MainContent>
        </Container>
    );
};

export const App = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT_ID}>
        <AppContent />
    </GoogleOAuthProvider>
);
