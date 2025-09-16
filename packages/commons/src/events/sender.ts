import { eventManager } from "./eventManager.js";

export function sendCustomEvent<T>(eventName: string, data: T): void {
  eventManager.emit(eventName, data);
}
