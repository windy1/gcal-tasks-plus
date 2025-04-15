import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const SpinnerWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;

export const SpinnerCenter = () => (
    <SpinnerWrapper>
        <CircularProgress />
    </SpinnerWrapper>
);
