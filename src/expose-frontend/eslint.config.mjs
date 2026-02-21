import path from "node:path"
import {fileURLToPath} from "node:url"
import js from "@eslint/js"
import {FlatCompat} from "@eslint/eslintrc"
import preactConfig from "eslint-config-preact"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended
})

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ),
    ...preactConfig,
    ...compat.env({
        browser: true,
        es2021: true
    }),
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module"
        },
        plugins: {
            "@typescript-eslint": tsPlugin
        },
        rules: {
            quotes: ["error", "double"],
            semi: ["error", "never"],
            "no-unused-vars": "warn",
            "@typescript-eslint/no-unused-vars": "off",
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
]
