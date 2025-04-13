import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import {
    fetchTaskLists,
    handleGoogleSignOut,
    handleTokenExpiration,
    useGoogleLoginWithStorage,
} from "@/hooks";
import { TaskList } from "@/data";
import { TaskLists } from "./TaskLists";
import { Button } from "./Button";
import { Tasks } from "./tasks/Tasks";
import { Spinner } from "./Spinner";

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const SignOutWrapper = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
`;

const AppContent = () => {
    const [token, setToken] = useState<string | null>(null);
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [selectedTaskList, setSelectedTaskList] = useState<TaskList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const login = useGoogleLoginWithStorage(setToken);

    const signOut = () => {
        handleGoogleSignOut(setToken);
        setTaskLists([]);
    };

    useEffect(() => handleTokenExpiration(setToken), []);

    useEffect(() => {
        if (!token) return;

        setLoading(true);

        fetchTaskLists(token, (lists) => {
            setTaskLists(lists);
            setLoading(false);
        });
    }, [token]);

    return (
        <Container>
            {token && (
                <SignOutWrapper>
                    <Button onClick={signOut}>Sign Out</Button>
                </SignOutWrapper>
            )}
            <h1>Google Calendar Tasks Plus</h1>

            {!token && <Button onClick={() => login()}>Sign in with Google</Button>}

            {token && loading && <Spinner />}

            {token && !loading && !selectedTaskList && (
                <TaskLists taskLists={taskLists} setSelectedTaskList={setSelectedTaskList} />
            )}

            {token && selectedTaskList && <Tasks taskList={selectedTaskList} />}
        </Container>
    );
};

export const App = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT_ID}>
        <AppContent />
    </GoogleOAuthProvider>
);
