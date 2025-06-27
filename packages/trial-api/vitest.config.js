"use strict";
exports.__esModule = true;
var config_1 = require("vitest/config");
exports["default"] = config_1.defineConfig({
    test: {
        setupFiles: ["dotenv/config"],
        testTimeout: 60000,
        hookTimeout: 60000
    }
});
