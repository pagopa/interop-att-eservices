import crypto from "crypto";

export default function generateHash(strings: string[]): string {
  // Concatena tutte le stringhe della lista
  const concatenatedString = strings.join("");

  // Crea un hash SHA-256
  const hash = crypto.createHash("sha256");

  // Aggiunge la stringa concatenata come input per l'hash
  hash.update(concatenatedString);

  // Restituisci l'hash in formato esadecimale
  return hash.digest("hex");
}

export function generateHashFromString(value: string): string {
  // Crea un hash SHA-256
  const hash = crypto.createHash("sha256");

  // Aggiunge la stringa concatenata come input per l'hash
  hash.update(value);

  // Restituisci l'hash in formato esadecimale
  return hash.digest("hex");
}
