import { CacheManager } from "./redis-manager.js";

const cacheManager = new CacheManager();

export { cacheManager };
export * from "./schema/index.js";
