/**
 * Config for npm-check-updates (`npm run check-updates` / `install-updates`).
 * Loaded automatically from this package directory.
 *
 * Most deps may jump to latest majors. TypeScript and ESLint stay on the current
 * major (`minor`) until the toolchain is ready for TypeScript 7 / ESLint 11.
 */
export default {
    target: (/** @type {string} */ name) => {
        // Cap these to patch/minor bumps within the pinned major.
        if (name === "typescript" || name === "eslint") {
            return "minor"
        }
        return "latest"
    },
}
