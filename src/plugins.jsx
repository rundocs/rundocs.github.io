import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, BaseStyles } from "@primer/react";

import LocalSearch from "./components/LocalSearch.jsx";

createRoot(document.querySelector("#plugins")).render(
    <StrictMode>
        <ThemeProvider
            colorMode="auto"
            dayScheme="light"
            nightScheme="dark_dimmed"
        >
            <BaseStyles>
                <LocalSearch />
            </BaseStyles>
        </ThemeProvider>
    </StrictMode>
);
