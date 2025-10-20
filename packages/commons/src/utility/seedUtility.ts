import crypto from "crypto";
import { logger } from "../logging/index.js";
import { shConfig } from "../config/shConfig.js";

export function getRotatedSeed(): string {
  // Handle the service call to determine which data to use from shConfig
  const config = shConfig(); // Possibile prevere un controllo per vedere se i valori sono null

  // Here there are four values (expiration, secret key, encryption algorithm, and maximum seed length)
  const nowMs: number = Date.now();

  const START_TIMESTAMP_MS: number = new Date(
    "2024-01-01T00:00:00.000Z"
  ).getTime();

  const ROTATION_PERIOD_MS: number =
    config.seedExpireDays * 24 * 60 * 60 * 1000;

  // const SALT_LENGTH: number = 16;
  const elapsedMs: number = nowMs - START_TIMESTAMP_MS;
  const periodId: number = Math.floor(elapsedMs / ROTATION_PERIOD_MS);

  const message: string = periodId.toString();

  const hmac = crypto.createHmac("sha256", config.masterSaltKey);
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
