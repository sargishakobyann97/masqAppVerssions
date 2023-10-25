/// <reference types="react-scripts" />
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./assets/i18next";
import "./index.scss";

createRoot(document.getElementById("root") as HTMLElement).render(
    <HashRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </HashRouter>
);
