import crypto from "crypto";

export default function generateHash(strings: string[]): string {
  const concatenatedString = strings.join("");

  const hash = crypto.createHash("sha256");

  hash.update(concatenatedString);

  return hash.digest("hex");
}

export function generateHashFromString(value: string): string {
  const hash = crypto.createHash("sha256");

  hash.update(value);

  return hash.digest("hex");
}
