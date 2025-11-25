import { initThemeMode } from "flowbite-react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./app/global.css";

createRoot(document.getElementById("root")!).render(
    <App />
);

initThemeMode();
