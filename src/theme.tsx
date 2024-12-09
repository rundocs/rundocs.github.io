import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, BaseStyles } from "@primer/react";

import "./theme.css";
import logger from "./ts/logger.ts";
import swRegister from "./ts/swRegister.ts";

export function createApp(children: React.JSX.Element) {
    let container = document.querySelector("main");
    if (container) {
        createRoot(container).render(
            <StrictMode>
                <ThemeProvider
                    colorMode="auto"
                    dayScheme="light"
                    nightScheme="dark_dimmed">
                    <BaseStyles>
                        {children}
                    </BaseStyles>
                </ThemeProvider>
            </StrictMode>
        );
    } else {
        logger("warn", "createApp", "container not founded")
    }
    swRegister();
}
