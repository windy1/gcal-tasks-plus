import { Palette } from "@/constants";
import styled from "styled-components";

export const Button = styled.button`
    background-color: ${Palette.ButtonColor};
    color: ${Palette.White};
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${Palette.ButtonHoverColor};
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px ${Palette.ButtonShadowColor};
    }
`;
