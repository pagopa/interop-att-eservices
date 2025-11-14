/* eslint-disable no-console */
import crypto from "crypto";
import { shClientMock } from "../../config/shClientMock";

export function getRotatedSeed(masterSaltKey: string): string {
  const config = shClientMock();
  const nowMs: number = Date.now();

  const START_TIMESTAMP_MS: number = new Date(
    "2024-01-01T00:00:00.000Z"
  ).getTime();

  const ROTATION_PERIOD_MS: number =
    config.seedExpireDays * 24 * 60 * 60 * 1000;

  const elapsedMs: number = nowMs - START_TIMESTAMP_MS;
  const periodId: number = Math.floor(elapsedMs / ROTATION_PERIOD_MS);

  const message: string = periodId.toString();

  const hmac = crypto.createHmac("sha256", masterSaltKey);
  hmac.update(message);

  const fullHash: string = hmac.digest("hex");

  const salt: string = fullHash.substring(0, config.saltLength);

  console.log(
    `Periodo ID: ${periodId} (salt valido fino a ${new Date(
      START_TIMESTAMP_MS + (periodId + 1) * ROTATION_PERIOD_MS
    ).toUTCString()}), Salt: ${salt}`
  );

  return salt;
}
