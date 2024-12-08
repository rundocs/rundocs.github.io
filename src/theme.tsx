import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, BaseStyles } from "@primer/react";

import "./theme.css";
import logger from "./utils/logger.ts";
import swRegister from "./utils/swRegister.ts";

export function createApp(children: React.JSX.Element) {
    const container = document.querySelector("main");
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
