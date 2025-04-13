import { Pallette } from "@/constants";
import styled from "styled-components";

export const Spinner = styled.div`
    border: 4px solid ${Pallette.White};
    border-left-color: ${Pallette.ButtonColor};
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
