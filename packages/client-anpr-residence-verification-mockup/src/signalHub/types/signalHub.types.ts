export type SignalType = "UPDATE" | "SEEDUPDATE" | "DELETE";

export interface Signal {
  signalId: number;
  signalType: SignalType;
  objectId: string;
  eserviceId: string;
  objectType: string;
}

export interface PullSignalsResponse {
  signals: Signal[];
  lastSignalId: number | null;
}

export interface CryptoConfig {
  seed: string;
  cryptoHashFunction: string;
}
