module.exports = {
    verbose: true,
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
        "^.+\\.mjs$": "jest-esm-transformer",
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(axios)/)"
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/styleMock.js",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleDirectories: ["node_modules", "src"],
};