import { defineConfig } from "vite";
import { handleNotFound, getEntries } from "./vite.config.plugins.js";

export default defineConfig({
    build: {
        rollupOptions: {
            input: getEntries(),
        },
    },
    appType: "mpa",
    plugins: [
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
})
