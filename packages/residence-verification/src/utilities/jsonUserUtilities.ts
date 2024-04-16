import { UserModel } from "pdnd-models";
import { classToPlain } from "class-transformer";

// Funzione che converte una stringa JSON in un oggetto della struttura specificata
export function parseJsonToUser(inputString: string | null): UserModel | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un oggetto JavaScript
    const parsedObject = JSON.parse(inputString);

    // Usa plainToClass per convertire l'oggetto JavaScript in un'istanza della classe UserModel
    return classToPlain(parsedObject) as UserModel;
  } catch (error) {
    console.error("Errore durante il parsing della stringa JSON:", error);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
// Funzione che converte una stringa JSON in un array di oggetti della struttura specificata
export function parseJsonToUserArray(
  inputString: string | null
): UserModel[] | null {
  try {
    if (inputString == null) {
      return null;
    }
    // Analizza la stringa in un array JavaScript
    const parsedArray = JSON.parse(inputString);

    // Controlla se il risultato è un array
    if (!Array.isArray(parsedArray)) {
      throw new Error("La stringa JSON non rappresenta un array");
    }

    // Mappa ogni elemento dell'array e lo converte in un'istanza della classe UserModel
    return parsedArray.map((item: any) => classToPlain(item) as UserModel);
  } catch (error) {
    console.error("Errore durante il parsing della stringa JSON:", error);
    return null; // Restituisci null se si verifica un errore durante il parsing
  }
}
