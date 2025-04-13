import { Palette } from "@/constants";
import styled from "styled-components";

export const Spinner = styled.div`
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
