import { createHash } from "crypto";

export const sha256 = (input: string): string => {
  return createHash("sha256").update(input).digest("hex");
};

export const encodeBase64 = (input: string): string => {
  return Buffer.from(input, "utf-8").toString("base64");
};
