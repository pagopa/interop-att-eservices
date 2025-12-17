/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { DatabaseConfig } from "../../config/databaseConfig.js";
import { logger } from "../../logging/index.js";

const { Pool } = pkg;

export type DrizzleClient = ReturnType<typeof drizzle>;

const state = {
  dbInstance: undefined as DrizzleClient | undefined,
};

export const initDB = (config: DatabaseConfig): DrizzleClient => {
  if (state.dbInstance) {
    return state.dbInstance;
  }

  const pool = new Pool({
    connectionString: config.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on("error", (err) => {
    if (logger) {
      logger.error("Unexpected error on idle database client", err);
    }
  });

  state.dbInstance = drizzle(pool);
  return state.dbInstance;
};

export const client = new Proxy({} as DrizzleClient, {
  get(_target, prop) {
    if (!state.dbInstance) {
      const errorMsg =
        "Database client not initialized. Call initDB(config) first.";
      if (logger) {
        logger.error(errorMsg);
      }
      throw new Error(errorMsg);
    }
    return Reflect.get(state.dbInstance, prop);
  },
});
