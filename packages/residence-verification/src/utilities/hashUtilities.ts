import crypto from "crypto";

export default function generateHash(strings: string[]): string {
  const concatenatedString = strings.join("");

  const hash = crypto.createHash("sha256");

  hash.update(concatenatedString);

  return hash.digest("hex");
}

export const encodeBase64 = (input: string): string =>
  Buffer.from(input, "utf-8").toString("base64");
