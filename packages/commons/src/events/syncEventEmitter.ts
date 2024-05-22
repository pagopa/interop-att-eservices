import { EventEmitter } from "events";

/* eslint-disable */
export class SyncEventEmitter extends EventEmitter {
  emitSync(event: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emit(event, { resolve, reject, args });
    });
  }
}
