import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { htmlEntries, mpaNotFound, setManifest } from "./vite.config.plugins.js";

export default defineConfig({
    appType: "mpa",
    build: {
        rollupOptions: {
            input: htmlEntries({
                ignoreDirs: [
                    "dist",
                    "node_modules"
                ],
                dirPath: process.cwd(),
            }),
        },
    },
    plugins: [
        react(),
        mpaNotFound(),
        setManifest("sw.js"),
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
