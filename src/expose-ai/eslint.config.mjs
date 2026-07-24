// @ts-check
import ts from "typescript-eslint"
import eslint from "@eslint/js"
import globals from "globals"

export default ts.config(
    {
        ignores: ["eslint.config.mjs"],
    },
    eslint.configs.recommended,
    ...ts.configs.recommended,
    {
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
        },
    },
);
