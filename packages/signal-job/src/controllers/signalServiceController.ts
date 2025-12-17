import { logger } from "pdnd-common";
import { SHRepository } from "../repositories/SHRepository.js";
import { SignalHubClient } from "../repositories/SignalHubClient.js";
import { shConfig } from "../config/config.js";

function isTodayFirstDayOfSeedPeriod(): boolean {
  const START_TIMESTAMP_MS = new Date(shConfig.startDateMs).getTime();
  const PERIOD_MS = shConfig.seedExpireDays * 24 * 60 * 60 * 1000;

  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).getTime();

  const msSinceStart = todayUTC - START_TIMESTAMP_MS;
  if (msSinceStart < 0) {
    return false;
  }

  const completedPeriods = Math.floor(msSinceStart / PERIOD_MS);
  const expectedStartDateOfCurrentPeriod =
    START_TIMESTAMP_MS + completedPeriods * PERIOD_MS;

  return todayUTC === expectedStartDateOfCurrentPeriod;
}

export class SeedRotationController {
  public static async executeSeedRotation(): Promise<void> {
    if (!isTodayFirstDayOfSeedPeriod()) {
      return;
    }

    logger.info("[SeedRotationController] Proceeding with SEEDUPDATE.");

    const eserviceIds = await SHRepository.getAllEserviceIds();
    logger.info(
      `[SeedRotationController] Found ${eserviceIds.length} e-services to update.`
    );

    for (const eserviceId of eserviceIds) {
      try {
        logger.info(
          `[SeedRotationController] Processing e-service: ${eserviceId}`
        );
        const newSignalId = await SHRepository.ensureAndIncrementSignalId(
          eserviceId
        );
        await SignalHubClient.sendSeedUpdateSignal(eserviceId, newSignalId);
        logger.info(
          `[SeedRotationController] SEEDUPDATE sent for ${eserviceId} with signalId=${newSignalId}`
        );
      } catch (error) {
        logger.error(
          `[SeedRotationController] Error for e-service ${eserviceId}:`,
          error
        );
      }
    }

    logger.info(
      "[SeedRotationController] Seed rotation completed successfully."
    );
  }
}
