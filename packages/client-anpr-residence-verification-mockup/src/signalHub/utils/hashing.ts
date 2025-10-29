import crypto from "crypto";

export function calculatePseudonym(
  clearText: string,
  seed: string,
  algorithm: string
): string {
  const dataToHash = clearText.concat(seed);

  const hash = crypto.createHash(algorithm).update(dataToHash).digest("hex");

  if (!hash) {
    throw new Error(`Errore nel calcolo dell'hash con algoritmo: ${algorithm}`);
  }

  return hash;
}
