// sender.ts (pacchetto mittente)
import { eventManager } from "./eventManager.js";

// Funzione per inviare un evento personalizzato
export function sendCustomEvent<T>(eventName: string, data: T): void {
  eventManager.emit(eventName, data);
}
