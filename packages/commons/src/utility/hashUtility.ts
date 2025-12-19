import crypto from "node:crypto";

export function generateHashFromString(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export const encodeBase64 = (input: string): string =>
  Buffer.from(input, "utf-8").toString("base64");
