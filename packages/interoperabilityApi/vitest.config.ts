import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["dotenv/config"],
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});