module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testRegex: ".*\\.(spec|e2e-spec)\\.ts$",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": ["ts-jest", {useESM: true}]
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    testPathIgnorePatterns: ["/node_modules/", "/dist/", "/src/test.ts$"]
}
