import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { htmlEntries, mpaNotFound, setManifest } from "./vite.extends.ts";

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
            output: {
                manualChunks: {
                    react: [
                        "react",
                        "react-dom"
                    ],
                    unified: [
                        "unified",
                        "rehype-highlight",
                        "rehype-raw",
                        "rehype-slug",
                        "rehype-stringify",
                    ],
                    remark: [
                        "remark-gemoji",
                        "remark-gfm",
                        "remark-parse",
                        "remark-rehype",
                        "remark-remove-comments",
                    ]
                }
            }
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
