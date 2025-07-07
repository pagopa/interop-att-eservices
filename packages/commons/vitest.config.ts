// packages/commons/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["dotenv/config"], // Ora punta al tuo setup personalizzato
    testTimeout: 60000,
    hookTimeout: 60000,
    environment: 'node', // Assicurati che l'ambiente sia Node.js per i test DB
  },
});