import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./components";
import axios from "axios";
import { delay } from "./utils";

if (import.meta.env.DEV) {
    axios.interceptors.request.use(async (config) => {
        await delay(import.meta.env.VITE_NETWORK_LATENCY);
        return config;
    });
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
