import { defineConfig } from "vitest/config";
import { config } from "dotenv";

config({ path: ".env.test" });

export default defineConfig({
  test: {
    testTimeout: 60000,
    hookTimeout: 60000,
    environment: 'node',
    deps: {
      inline: ["pdnd-common"],
    },
  },
});