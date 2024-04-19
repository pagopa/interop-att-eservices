import { createClient } from "redis";
import { logger } from "../logging/index.js";

export class CacheManager {
  private readonly client;

  constructor() {
    try {
      this.client = createClient({
        url: process.env.REDIS_ENDPOINT, // Usa l'URL fornito o il default se non specificato
      });

      this.client.on("error", (error: Error) => {
        // eslint-disable-next-line no-console
        logger.error(`Redis client error: ${error}`);
        throw new Error("Redis client error"); 
      });

      if (!this.isHealthy) {
        logger.error(`Redis client error`);
        throw new Error("Redis client error"); 
      }
    } catch (error) {
      logger.error(`Error creating Redis client: ${error}`);
      throw new Error("Error creating Redis client"); 
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      if (await this.isHealthy()) {
        logger.info(`Redis client ok`);
        return true;
      }
    } catch (error) {
      logger.error(`Redis client error`);
      return false;
    }
    return false;
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

/*   private async connectIfNecessary(): Promise<void> {
    if (this.client.isReady) {
      return;
    }

    await this.client.connect();
  } */

  private async connectIfNecessary(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client.isReady) {
        resolve();
      } else {
        this.client.on("ready", () => {
          resolve();
        });
        this.client.on("error", (error) => {
          reject(error);
        });
        this.client.connect();
      }
    });
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
