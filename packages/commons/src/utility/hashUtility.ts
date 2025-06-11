import crypto from "crypto";

export function generateHashFromString(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
