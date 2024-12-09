import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";


/** @type {import("eslint").Linter.Config[]} */
export default [
    { files: ["**/*.{js,ts,tsx}"] },
    { languageOptions: { globals: globals.browser } },
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
