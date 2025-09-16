import { logger } from "../index.js";

export const bufferToString = (buffer: Buffer): string | null => {
  const encodingsToTry: BufferEncoding[] = ["utf8", "utf16le", "latin1"];

  for (const encoding of encodingsToTry) {
    try {
      return buffer.toString(encoding);
    } catch (error) {
      logger.error(`Errore durante la conversione in ${encoding}:`, error);
    }
  }

  return null;
};
