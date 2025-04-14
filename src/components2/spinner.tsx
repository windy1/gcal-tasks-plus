import { Palette } from "@/constants";
import styled from "styled-components";

const SpinnerWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;

const SpinnerCircle = styled.div`
    border: 4px solid ${Palette.White};
    border-left-color: ${Palette.ButtonColor};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export const Spinner = () => (
    <SpinnerWrapper>
        <SpinnerCircle />
    </SpinnerWrapper>
);
