import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    setupFiles: ["dotenv/config"],
    testTimeout: 60000,
    hookTimeout: 60000,
  },
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "src") }],
  },
});
