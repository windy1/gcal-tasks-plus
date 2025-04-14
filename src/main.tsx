import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components";
import axios from "axios";
import { delay } from "./utils";
import { GlobalStyle } from "./global-style";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const Root = "root";

if (import.meta.env.DEV) {
    axios.interceptors.request.use(async (config) => {
        await delay(import.meta.env.VITE_NETWORK_LATENCY);
        return config;
    });
}

createRoot(document.getElementById(Root)!).render(
    <StrictMode>
        <GlobalStyle />
        <App />
    </StrictMode>,
);
