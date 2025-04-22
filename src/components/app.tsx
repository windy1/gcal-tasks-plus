import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { TaskList } from "@/data";
import { AppRoutes, Palette } from "@/constants";
import { TaskApi } from "@/services";
import { AuthContext } from "@/contexts";
import { useContext } from "@/hooks";
import { AuthProvider } from "@/providers";
import { SpinnerCenter, TaskLists } from ".";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Tasks } from "./tasks";
import { Button } from "./input";
import { DebugButton } from "./input/debug-button";

const TitleString = "Google Calendar Tasks Plus";

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

export const App = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT_ID}>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </GoogleOAuthProvider>
);

const AppContent = () => {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { isAuthenticated } = useContext(AuthContext);

    const handleSignOut = () => {
        setTaskLists([]);
        setLoading(false);
    };

    const handleLogin = () => {
        console.debug("Fetching task lists...");

        setLoading(true);

        TaskApi.fetchTaskLists().then((taskLists) => {
            console.debug("Task lists fetched:", taskLists);
            setTaskLists(taskLists);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!isAuthenticated) {
            handleSignOut();
            return;
        }

        handleLogin();
    }, [isAuthenticated]);

    return (
        <BrowserRouter>
            <Container>
                <Header>
                    <HeaderContent>
                        <Title>{TitleString}</Title>
                        <AuthButton />
                    </HeaderContent>
                </Header>
                <DebugButton />
                <MainContent>
                    {isAuthenticated && loading && <SpinnerCenter />}
                    {isAuthenticated && !loading && <RoutesWrapper taskLists={taskLists} />}
                </MainContent>
            </Container>
        </BrowserRouter>
    );
};

const AuthButton = () => {
    const { isAuthenticated, login, signOut } = useContext(AuthContext);

    if (isAuthenticated) {
        return <Button onClick={signOut}>Sign Out</Button>;
    }

    return <Button onClick={login}>Sign in</Button>;
};

const RoutesWrapper = ({ taskLists }: { taskLists: TaskList[] }) => (
    <Routes>
        <Route path={AppRoutes.TaskLists()} element={<TaskLists taskLists={taskLists} />} />
        <Route path={AppRoutes.Tasks()} element={<TasksWrapper taskLists={taskLists} />} />
    </Routes>
);

const TasksWrapper = ({ taskLists }: { taskLists: TaskList[] }) => {
    const { taskListId } = useParams();
    const navigate = useNavigate();
    const taskList = taskLists.find((list) => list.id === taskListId);

    useEffect(() => {
        if (!taskList) {
            navigate(AppRoutes.TaskLists());
        }
    }, [taskList, navigate]);

    return taskList ? <Tasks taskList={taskList} /> : null;
};
