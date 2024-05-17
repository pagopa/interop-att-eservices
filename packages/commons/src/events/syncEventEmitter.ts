import { EventEmitter } from 'events';

/*
interface SyncEventPayload {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  args: any[];
}*/

export class SyncEventEmitter extends EventEmitter {
  emitSync(event: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.emit(event, { resolve, reject, args });
    });
  }
}
