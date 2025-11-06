/* eslint-disable no-console */
import axios from "axios";
import {
  CryptoConfig,
  PullSignalsResponse,
  Signal,
} from "../types/signalHub.types.js";
import { calculatePseudonym } from "../utils/hashing.js";
import { shClientMock } from "../../config/shClientMock.js";
import { getEserviceIdFromToken } from "../utils/getEserviceIdForMockClient.js";
import { getRotatedSeed } from "../utils/seedUtilityClientMock.js";

type PollResult = {
  totalProcessed: number;
  relevantFound: number;
  finalSignalId: number;
};

type RecursivePollResult = {
  pollResult: PollResult;
  lastRawResponse: PullSignalsResponse;
};

type BatchProcessResult = {
  relevantCount: number;
  seedUpdateFound: boolean;
  seedUpdateSignalId: number | null;
  processedCount: number;
  stop: boolean;
};

type PollingContext = {
  authorizationHeader: string;
  eserviceId: string;
  baseUrl: string;
  pseudonymMap: Map<string, string>;
  size: number;
};

// TODO: Convert log to logger.info and logger.error
export const signalHubService = {
  async processSignalsForTest(
    authorizationHeader: string,
    m2mToken: string,
    size: number,
    citizenCf: string,
    startSignalId: number
  ): Promise<PullSignalsResponse> {
    console.log(
      `[SignalHubService] Starting signal retrieval test (Batch size: ${size}, CF: ${citizenCf})...`
    );
    const config = shClientMock();

    const baseUrl = `${config.signalHubHost}/${config.signalHubApiVersion}`;
    if (!baseUrl) {
      throw new Error("SignalHub configuration (baseUrl) is missing.");
    }
    console.log(
      `[SignalHubService] authorizationHeader : ${authorizationHeader}`
    );

    const eserviceId = await getEserviceIdFromToken(authorizationHeader);
    console.log(
      `[SignalHubService] EserviceId extracted from token: ${eserviceId}`
    );

    const cryptoConfig = signalHubService.getLocalCryptoConfig(
      eserviceId,
      config
    );

    const pseudonymMap = signalHubService.generatePseudonymMap(
      [citizenCf],
      cryptoConfig.seed,
      cryptoConfig.cryptoHashFunction
    );
    console.log(`[SignalHubService] Pseudonym map generated for 1 citizen.`);

    const pollingContext: PollingContext = {
      authorizationHeader: m2mToken,
      eserviceId,
      baseUrl,
      pseudonymMap,
      size,
    };

    const result = await signalHubService.pollBatchRecursive(
      pollingContext,
      startSignalId
    );

    console.log(
      `[SignalHubService] Polling completed. Total signals: ${result.pollResult.totalProcessed}, Relevant: ${result.pollResult.relevantFound}.`
    );

    return result.lastRawResponse;
  },

  async pollBatchRecursive(
    context: PollingContext,
    currentSignalId: number
  ): Promise<RecursivePollResult> {
    console.log(
      `[SignalHubService] PULL call to ${context.baseUrl} for e-service ${context.eserviceId}, from signalId ${currentSignalId}, size ${context.size}`
    );

    const response = await signalHubService.fetchSignalsBatch(
      context.baseUrl,
      context.authorizationHeader,
      context.eserviceId,
      currentSignalId,
      context.size
    );

    const rawResponseData = response.data;
    const { signals, lastSignalId } = rawResponseData;
    const httpStatus = response.status;

    if (!signals || signals.length === 0) {
      console.log("[SignalHubService] No new signals received.");
      return {
        pollResult: {
          totalProcessed: 0,
          relevantFound: 0,
          finalSignalId: currentSignalId,
        },
        lastRawResponse: rawResponseData,
      };
    }

    console.log(
      `[SignalHubService] Received ${signals.length} signals. Status: ${httpStatus}`
    );

    const processingResult = signalHubService.processBatch(
      signals,
      context.pseudonymMap
    );

    if (processingResult.seedUpdateFound) {
      console.log(
        "[SignalHubService] 'seedUpdate' signal found! Stopping polling."
      );
      return {
        pollResult: {
          totalProcessed: processingResult.processedCount,
          relevantFound: processingResult.relevantCount,
          finalSignalId: processingResult.seedUpdateSignalId!,
        },
        lastRawResponse: rawResponseData,
      };
    }

    const newSignalId = lastSignalId!;

    if (httpStatus === 206) {
      console.log(
        "[SignalHubService] HTTP 206 Partial Content. Continuing polling..."
      );

      const nextBatchResult = await signalHubService.pollBatchRecursive(
        context,
        newSignalId
      );

      return {
        pollResult: {
          totalProcessed:
            signals.length + nextBatchResult.pollResult.totalProcessed,
          relevantFound:
            processingResult.relevantCount +
            nextBatchResult.pollResult.relevantFound,
          finalSignalId: nextBatchResult.pollResult.finalSignalId,
        },
        lastRawResponse: nextBatchResult.lastRawResponse,
      };
    }

    console.log(
      "[SignalHubService] HTTP 200 OK. No more signals at this time."
    );
    return {
      pollResult: {
        totalProcessed: signals.length,
        relevantFound: processingResult.relevantCount,
        finalSignalId: newSignalId,
      },
      lastRawResponse: rawResponseData,
    };
  },

  getLocalCryptoConfig(
    eserviceId: string,
    config: ReturnType<typeof shClientMock>
  ): CryptoConfig {
    const algorithm = config.algorithm;
    const seed = getRotatedSeed(eserviceId);

    console.log(
      `[SignalHubService] Crypto info loaded: [Algo: ${algorithm}, Seed: ${seed.substring(
        0,
        8
      )}...]`
    );
    return { seed, cryptoHashFunction: algorithm };
  },

  generatePseudonymMap(
    citizens: string[],
    seed: string,
    algorithm: string
  ): Map<string, string> {
    const map = new Map<string, string>();
    for (const cf of citizens) {
      const hash = calculatePseudonym(cf, seed, algorithm);
      map.set(hash, cf);
    }
    if (citizens.length > 0 && citizens[0]) {
      console.log(
        `[SignalHubService] Hash generated for ${
          citizens[0]
        }: ${calculatePseudonym(citizens[0], seed, algorithm)}`
      );
    }
    return map;
  },

  processBatch(
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
          `[SignalHubService] ==> Found CRITICAL 'SEEDUPDATE' SIGNAL (SignalID: ${signal.signalId})`
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
          `[SignalHubService] ==> Found RELEVANT signal (SignalID: ${signal.signalId}) for user ${clearTextId}.`
        );
        return {
          ...acc,
          processedCount,
          relevantCount: acc.relevantCount + 1,
        };
      }

      return { ...acc, processedCount };
    }, initialResult);
  },

  // TODO: use this for obtain dato to analyze
  async fetchSignalsBatch(
    baseUrl: string,
    authorizationHeader: string,
    eserviceId: string,
    signalId: number,
    size: number
  ): Promise<{ data: PullSignalsResponse; status: number }> {
    const pullUrl = `${baseUrl}/pull/signals/${eserviceId}`;
    const params = { signalId, size };

    console.log(
      `[SignalHubService] API Call: GET ${pullUrl} - Parameters: ${JSON.stringify(
        params
      )}`
    );

    try {
      const response = await axios.get<PullSignalsResponse>(pullUrl, {
        headers: { Authorization: `Bearer ${authorizationHeader}` },
        params,
        validateStatus: (status) => status === 200 || status === 206,
      });
      return { data: response.data, status: response.status };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[SignalHubService] API Error (${error.response?.status}): ${error.message}`
        );
      }
      throw new Error(`Error during signal pull: ${error}`);
    }
  },
};
