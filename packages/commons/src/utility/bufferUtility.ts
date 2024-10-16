import { logger } from "../index.js";

// Funzione per convertire un Buffer in una stringa utilizzando diversi encoding
export const bufferToString = (buffer: Buffer): string | null => {
  // Elenco di encoding da provare, puoi aggiungere altri se necessario
  const encodingsToTry: BufferEncoding[] = ["utf8", "utf16le", "latin1"];

  // Prova ciascun encoding fino a quando non si ottiene una stringa leggibile
  for (const encoding of encodingsToTry) {
    try {
      return buffer.toString(encoding);
    } catch (error) {
      logger.error(`Errore durante la conversione in ${encoding}:`, error);
    }
  }

  // Nessun encoding ha prodotto una stringa leggibile
  return null;
};
