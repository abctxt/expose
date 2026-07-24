// @ts-check
import ts from "typescript-eslint"
import preact from "eslint-config-preact"
import globals from "globals"

export default ts.config(
    // eslint-config-preact already includes @eslint/js recommended + Preact/React rules
    ...preact,
    ...ts.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        rules: {
            quotes: ["error", "double"],
            semi: ["error", "never"],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "no-empty-function": "warn",
            "@typescript-eslint/no-empty-function": "off",
            "react/jsx-tag-spacing": [
                "warn",
                {
                    beforeSelfClosing: "never"
                }
            ],
            "react/self-closing-comp": [
                "warn",
                {
                    component: true,
                    html: true
                }
            ],
            "no-console": "warn",
            "prefer-const": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "react/jsx-curly-spacing": ["warn", "never"],
            "react/jsx-indent": ["warn", 4]
        }
    }
)
