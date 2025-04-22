import { AuthContext } from "@/contexts";
import { useContext } from "@/hooks";
import { AppUtil } from "@/utils";
import styled from "styled-components";
import { Button } from "./button";
import { AuthStorage } from "@/services";

const Text = "Invalidate Token";

const DebugButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 2rem;
`;

export const DebugButton = () => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!AppUtil.isDebugMode() || !isAuthenticated) {
        return null;
    }

    return (
        <DebugButtonContainer>
            <Button onClick={() => AuthStorage.clearToken()}>{Text}</Button>
        </DebugButtonContainer>
    );
};
