/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, sql } from "drizzle-orm";
import { logger } from "pdnd-common";
import { client } from "../../index.js";
import { signalCounters } from "../../db/schema/singalHub/signalCounters.model.js";
import { Seed } from "../../db/schema/seed.model.js";

type EserviceConfigRow = {
  idSeed: string;
  eServiceId: string;
  algorithm: string;
};

export const SHRepository = {
  async findConfigByEserviceId(
    eserviceId: string
  ): Promise<EserviceConfigRow | undefined> {
    logger.info(`[SHRepository] Searching config for e-service: ${eserviceId}`);

    try {
      const results = await client
        .select()
        .from(Seed)
        .where(eq(Seed.eServiceId, eserviceId))
        .limit(1)
        .execute();

      const config = results[0];

      if (!config) {
        logger.warn(`[SeedRepository] Config not found for ${eserviceId}`);
      }

      return config;
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      logger.error(`[SeedRepository] DB Error: ${errorMessage}`);
      throw new Error("Error retrieving seed configuration.");
    }
  },
  async incrementAndGetSignalId(eserviceId: string): Promise<number> {
    logger.info(`[SHRepository] Incrementing signalId for: ${eserviceId}`);
    try {
      const results = await client
        .update(signalCounters)
        .set({ signalId: sql`${signalCounters.signalId} + 1` })
        .where(eq(signalCounters.eserviceId, eserviceId))
        .returning({ newId: signalCounters.signalId })
        .execute();

      if (!results || results.length === 0) {
        logger.error(
          `[SHRepository] Counter not found for ${eserviceId}. Ensure the row exists in 'signal_counters'.`
        );
        throw new Error(
          `Signal counter not initialized for e-service: ${eserviceId}`
        );
      }

      const newSignalId = results[0].newId;
      logger.info(
        `[SHRepository] New signalId generated: ${newSignalId} for ${eserviceId}`
      );
      return newSignalId;
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      logger.error(
        `[SHRepository] DB Error during signalId increment: ${errorMessage}`
      );
      throw new Error("DB Error during signalId generation.");
    }
  },
};
