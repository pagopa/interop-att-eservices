import { StatusProcessingRequestModel } from "pdnd-models";

// Mappa per la conversione
export const statusMap: { [key: number]: StatusProcessingRequestModel } = {
  5: "PRESA_IN_CARICO",
  4: "IN_ELABORAZIONE",
  3: "IN_ELABORAZIONE",
  2: "IN_ELABORAZIONE",
  1: "DISPONIBILE",
};

// Funzione di conversione che ritorna una stringa
export function getStatusFromNumber(num: number): StatusProcessingRequestModel {
  return statusMap[num];
}

// Funzione per ottenere il massimo numero
export function getMaxNumber(): number {
  return Math.max(...Object.keys(statusMap).map(Number));
}
