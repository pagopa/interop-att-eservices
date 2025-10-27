import {
  CryptoConfig,
  PullSignalsResponse,
  Signal,
} from "../types/signalHub.types.js";
import { calculatePseudonym } from "../utils/hashing.js";
import axios from "axios";
import { shClientMock } from "../../config/shClientMock.js";
import { getEserviceIdFromToken } from "../utils/getEserviceIdForMockClient.js";
import { getRotatedSeed } from "../utils/seedUtilityClientMock.js";

type PollResult = {
  totalProcessed: number;
  relevantFound: number;
  finalSignalId: number;
};

type BatchProcessResult = {
  relevantCount: number;
  seedUpdateFound: boolean;
  seedUpdateSignalId: number | null;
  processedCount: number;
  stop: boolean;
};

class SignalHubService {
  public async processSignalsForTest(
    authorizationHeader: string,
    size: number,
    citizenCf: string,
    startSignalId: number
  ): Promise<any> {
    console.log(
      `[SignalHubService] Avvio test recupero segnali (Batch size: ${size}, CF: ${citizenCf})...`
    );

    const config = shClientMock();

    const baseUrl = config.signalHubHost + `/${config.signalHubApiVersion}`;
    if (!baseUrl) {
      throw new Error("Configurazione SignalHub (baseUrl) mancante.");
    }
  console.log(
      `[SignalHubService] authorizationHeader : ${authorizationHeader}`
    );

    const eserviceId = await getEserviceIdFromToken(authorizationHeader);
    console.log(
      `[SignalHubService] EserviceId estratto dal token: ${eserviceId}`
    );

    const cryptoConfig = this.getLocalCryptoConfig(eserviceId, config);

    const pseudonymMap = this.generatePseudonymMap(
      [citizenCf], 
      cryptoConfig.seed,
      cryptoConfig.cryptoHashFunction
    );
    console.log(
      `[SignalHubService] Mappa pseudonimi generata per 1 cittadino.`
    );

    const pollResult = await this.pollBatchRecursive(
      authorizationHeader,
      eserviceId,
      baseUrl,
      pseudonymMap,
      startSignalId,
      size
    );


    console.log(
      `[SignalHubService] Polling completato. Totale segnali: ${pollResult.totalProcessed}, Rilevanti: ${pollResult.relevantFound}.`
    );

    return {
      status: "Completato",
      totalProcessed: pollResult.totalProcessed,
      relevantFound: pollResult.relevantFound,
      lastSavedSignalId: pollResult.finalSignalId,
    };
  }

  private async pollBatchRecursive(
    authorizationHeader: string,
    eserviceId: string,
    baseUrl: string,
    pseudonymMap: Map<string, string>,
    currentSignalId: number,
    size: number
  ): Promise<PollResult> {
    console.log(
      `[SignalHubService] Chiamata PULL a ${baseUrl} per e-service ${eserviceId}, da signalId ${currentSignalId}, size ${size}`
    );

    const response = await this.fetchSignalsBatch(
      baseUrl,
      authorizationHeader,
      eserviceId,
      currentSignalId,
      size
    );

    const { signals, lastSignalId } = response.data;
    const httpStatus = response.status;

    if (!signals || signals.length === 0) {
      console.log("[SignalHubService] Nessun nuovo segnale ricevuto.");
      return {
        totalProcessed: 0,
        relevantFound: 0,
        finalSignalId: currentSignalId,
      };
    }

    console.log(
      `[SignalHubService] Ricevuti ${signals.length} segnali. Status: ${httpStatus}`
    );

    const processingResult = this.processBatch(signals, pseudonymMap);

    if (processingResult.seedUpdateFound) {
      console.log(
        "[SignalHubService] Trovato segnale 'seedUpdate'! Interrompo polling."
      );
      return {
        totalProcessed: processingResult.processedCount,
        relevantFound: processingResult.relevantCount,
        finalSignalId: processingResult.seedUpdateSignalId!,
      };
    }

    const newSignalId = lastSignalId!;

    if (httpStatus === 206) {
      console.log(
        "[SignalHubService] HTTP 206 Partial Content. Continuo il polling..."
      );

      const nextBatchResult = await this.pollBatchRecursive(
        authorizationHeader,
        eserviceId,
        baseUrl,
        pseudonymMap,
        newSignalId,
        size
      );

      return {
        totalProcessed: signals.length + nextBatchResult.totalProcessed,
        relevantFound:
          processingResult.relevantCount + nextBatchResult.relevantFound,
        finalSignalId: nextBatchResult.finalSignalId,
      };
    }

    console.log(
      "[SignalHubService] HTTP 200 OK. Non ci sono altri segnali al momento."
    );
    return {
      totalProcessed: signals.length,
      relevantFound: processingResult.relevantCount,
      finalSignalId: newSignalId,
    };
  }

  private getLocalCryptoConfig(
    eserviceId: string,
    config: ReturnType<typeof shClientMock>
  ): CryptoConfig {
    const algorithm = config.algorithm;

    const seed = getRotatedSeed(eserviceId);

    console.log(
      `[SignalHubService] Info crypto caricate: [Algo: ${algorithm}, Seed: ${seed.substring(
        0,
        8
      )}...]`
    );
    return { seed: seed, cryptoHashFunction: algorithm };
  }

  private generatePseudonymMap(
    citizens: string[],
    seed: string,
    algorithm: string
  ): Map<string, string> {
    const map = new Map<string, string>();
    // Ora 'citizens' è un array con un solo CF
    for (const cf of citizens) { 
      const hash = calculatePseudonym(cf, seed, algorithm);
      map.set(hash, cf);
    }
    if (citizens.length > 0 && citizens[0]) {
       console.log(`[SignalHubService] Hash generato per ${citizens[0]}: ${calculatePseudonym(citizens[0], seed, algorithm)}`);
    }

    return map;
  }

  // ... (processBatch non cambia)
  private processBatch(
    signals: Signal[],
    pseudonymMap: Map<string, string>
  ): BatchProcessResult {
    const initialResult: BatchProcessResult = {
      relevantCount: 0,
      seedUpdateFound: false,
      seedUpdateSignalId: null,
      processedCount: 0,
      stop: false,
    };

    return signals.reduce((acc, signal) => {
      if (acc.stop) {
        return acc;
      }

      const processedCount = acc.processedCount + 1;

      if (signal.signalType === "SEEDUPDATE") {
        console.log(
          `[SignalHubService] ==> Trovato SEGNALE CRITICO 'SEEDUPDATE' (SignalID: ${signal.signalId})`
        );
        return {
          ...acc,
          processedCount,
          seedUpdateFound: true,
          seedUpdateSignalId: signal.signalId,
          stop: true,
        };
      }

      const clearTextId = pseudonymMap.get(signal.objectId);
      if (clearTextId) {
        console.log(
          `[SignalHubService] ==> Trovato segnale RILEVANTE (SignalID: ${signal.signalId}) per l'utente ${clearTextId}.`
        );
        return {
          ...acc,
          processedCount,
          relevantCount: acc.relevantCount + 1,
        };
      }

      return { ...acc, processedCount };
    }, initialResult);
  }

  private async fetchSignalsBatch(
    baseUrl: string,
    authorizationHeader: string,
    eserviceId: string,
    signalId: number,
    size: number
  ): Promise<{ data: PullSignalsResponse; status: number }> {
    const pullUrl = `${baseUrl}/pull/signals/${eserviceId}`;

    const params = {
      signalId: signalId,
      size: size,
    };

    console.log(
      `[SignalHubService] Chiamata API: GET ${pullUrl} - Parametri: ${JSON.stringify(
        params
      )}`
    );

    try {
      const response = await axios.get<PullSignalsResponse>(pullUrl, {
        headers: { Authorization: authorizationHeader },
        params: params,
        validateStatus: (status) => status === 200 || status === 206,
      });
      return { data: response.data, status: response.status };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[SignalHubService] Errore API (${error.response?.status}): ${error.message}`
        );
      }
      throw new Error(`Errore durante il pull dei segnali: ${error}`);
    }
  }
}

export const signalHubService = new SignalHubService();