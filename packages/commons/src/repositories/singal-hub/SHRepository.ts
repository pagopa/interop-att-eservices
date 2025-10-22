/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from "drizzle-orm";
import { getRotatedSeed, logger, signalCounters } from "pdnd-common";
import { client } from "../../index.js";

export const SHRepository = {
  async findConfigByEserviceId(eserviceId: string): Promise<string> {
    try {
      const seed = getRotatedSeed(eserviceId);
      if (!seed) {
        logger.error(
          `[SeedRepository] Seed non configurato per l'e-service: ${eserviceId}`
        );
        throw new Error(`Seed non configurato per l'e-service: ${eserviceId}`);
      }
      return seed;
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      logger.error(`[SeedRepository] DB Error: ${errorMessage}`);
      throw new Error("Error retrieving seed configuration.");
    }
  },
  async ensureAndIncrementSignalId(eserviceId: string): Promise<number> {
    logger.info(
      `[SHRepository] Ensuring and incrementing signalId for: ${eserviceId}`
    );
    try {
      const results = await client
        .insert(signalCounters)
        .values({
          eserviceId,
          signalId: 1,
        })
        .onConflictDoUpdate({
          target: signalCounters.eserviceId,
          set: {
            signalId: sql`${signalCounters.signalId} + 1`,
          },
        })
        .returning({ newId: signalCounters.signalId })
        .execute();

      if (!results || results.length === 0) {
        logger.error(
          `[SHRepository] Upsert operation failed unexpectedly for ${eserviceId}.`
        );
        throw new Error(
          `Signal counter operation failed for e-service: ${eserviceId}`
        );
      }

      const newSignalId = results[0].newId;
      logger.info(
        `[SHRepository] New signalId is: ${newSignalId} for ${eserviceId}`
      );
      return newSignalId;
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      logger.error(
        `[SHRepository] DB Error during signalId upsert: ${errorMessage}`
      );
      throw new Error("DB Error during signalId generation.");
    }
  },
};
