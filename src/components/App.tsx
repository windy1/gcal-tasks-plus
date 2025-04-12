import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import {
    fetchTasks,
    handleGoogleSignOut,
    handleTokenExpiration,
    useGoogleLoginWithStorage,
} from "@/hooks";
import { TaskList } from "@/data";

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

const StyledButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #0056b3;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
    }
`;

const AppContent = () => {
    const [token, setToken] = useState<string | null>(null);
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);

    const login = useGoogleLoginWithStorage(setToken);

    const signOut = () => {
        handleGoogleSignOut(setToken);
        setTaskLists([]);
    };

    useEffect(() => handleTokenExpiration(setToken), []);
    useEffect(() => fetchTasks(token, setTaskLists), [token]);

    return (
        <Container>
            {token && (
                <SignOutWrapper>
                    <StyledButton onClick={signOut}>Sign Out</StyledButton>
                </SignOutWrapper>
            )}
            <h1>Google Calendar Tasks Plus</h1>
            {!token ? (
                <StyledButton onClick={() => login()}>Sign in with Google</StyledButton>
            ) : (
                <div>
                    <h2>Your Task Lists</h2>
                    <ul>
                        {taskLists.map((list) => (
                            <li key={list.id}>{list.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Container>
    );
};

export const App = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT_ID}>
        <AppContent />
    </GoogleOAuthProvider>
);
