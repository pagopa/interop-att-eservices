import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["dotenv/config", "./vitest.setup.ts"],
    testTimeout: 60000,
    hookTimeout: 60000,
    environment: 'node',
    deps: {
      inline: ["pdnd-common"],
    },
  },
});