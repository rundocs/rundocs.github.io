import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handleNotFound, getHtmlEntries } from "./vite.config.plugins.js";

export default defineConfig({
    appType: "mpa",
    build: {
        rollupOptions: {
            input: getHtmlEntries(),
        },
    },
    plugins: [
        react(),
        handleNotFound(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    "import",
                    "global-builtin",
                ],
            },
        },
    },
});
