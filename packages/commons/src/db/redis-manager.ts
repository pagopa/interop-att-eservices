import { createClient } from "redis";
import { logger } from "../logging/index.js";

export class CacheManager {
  private readonly client;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_ENDPOINT, // Usa l'URL fornito o il default se non specificato
    });

    this.client.on("error", (error: Error) => {
      // eslint-disable-next-line no-console
      logger.error(`Redis client error`, error);
    });

    if (!this.isHealthy) {
      logger.error(`Redis client error`);
    }
  }

  public async setObject(
    key: string,
    value: string,
    options: { expirationInMs?: number } = {}
  ): Promise<string> {
    await this.connectIfNecessary();

    await this.client.set(key, value, {
      PX: options.expirationInMs,
    });

    return value;
  }

  public async getObjectByKey(key: string): Promise<string | null> {
    await this.connectIfNecessary();
    const value = await this.client.get(key);

    if (value !== undefined) {
      return value;
    } else {
      return null;
    }
  }

  public async deleteAllObjectByKey(key: string): Promise<void> {
    await this.connectIfNecessary();
    await this.client.del(key);
  }

  private async connectIfNecessary(): Promise<void> {
    if (this.client.isReady) {
      return;
    }

    await this.client.connect();
  }

  private async isHealthy(): Promise<boolean> {
    try {
      await this.connectIfNecessary();
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}
