import { Palette } from "@/constants";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: ${Palette.RootColor};
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

a {
    font-weight: 500;
    color: ${Palette.LinkColor};
    text-decoration: inherit;
}

a:hover {
    color: ${Palette.LinkColorHover};
}

body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
`;
