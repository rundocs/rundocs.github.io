import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";

/** @type {import("eslint").Linter.Config[]} */
export default [
    {
        ignores: [
            "**/dist/",
            "**/node_modules/",
        ],
    },
    {
        languageOptions: {
            globals: globals.browser,
        },
        files: [
            "**/*.{js,ts,tsx}",
        ],
    },
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        ...react.configs.flat.recommended,
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
        },
    }
];
