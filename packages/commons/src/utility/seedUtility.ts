import crypto from "node:crypto";
import { logger } from "../logging/index.js";
import { ShConfig } from "../config/shConfig.js";

export function getRotatedSeed(
  masterSaltKey: string,
  config: ShConfig
): string {
  const nowMs: number = Date.now();

  const START_TIMESTAMP_MS: number = new Date(config.startDateMs).getTime();

  const ROTATION_PERIOD_MS: number =
    config.seedExpireDays * 24 * 60 * 60 * 1000;

  const elapsedMs: number = nowMs - START_TIMESTAMP_MS;
  const periodId: number = Math.floor(elapsedMs / ROTATION_PERIOD_MS);
  const message: string = periodId.toString();

  logger.info("START_TIMESTAMP_MS: ", START_TIMESTAMP_MS);

  const hmac = crypto.createHmac("sha256", masterSaltKey);
  hmac.update(message);

  const fullHash: string = hmac.digest("hex");

  const salt: string = fullHash.substring(0, config.saltLength);

  logger.info(
    `Periodo ID: ${periodId} (salt valido fino a ${new Date(
      START_TIMESTAMP_MS + (periodId + 1) * ROTATION_PERIOD_MS
    ).toUTCString()}), Salt: ${salt}`
  );

  return salt;
}
