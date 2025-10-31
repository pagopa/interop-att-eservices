/* eslint-disable no-console */
import axios from "axios";
import { PullSignalsResponse } from "../types/signalHub.types.js";
import { shClientMock } from "../../config/shClientMock.js";
import { getEserviceIdFromToken } from "../utils/getEserviceIdForMockClient.js";

class SignalHubService {
  public async processSignalsForTest(
    authorizationHeader: string,
    size: number,
    citizenCf: string,
    startSignalId: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<PullSignalsResponse> {
    console.log(
      `[SignalHubService] Starting signal retrieval test (Batch size: ${size}, CF: ${citizenCf})...`
    );

    const config = shClientMock();

    const baseUrl = `${config.signalHubHost}/${config.signalHubApiVersion}`;
    if (!baseUrl) {
      throw new Error("SignalHub configuration (baseUrl) is missing.");
    }

    const eserviceId = await getEserviceIdFromToken(authorizationHeader);
    console.log(
      `[SignalHubService] EserviceId extracted from token: ${eserviceId}`
    );

    // TODO: This mock token should be removed and the real header used.
    const mockToken =
      "eyJhbGciOiJSUzI1NiIsInVzZSI6InNpZyIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImFjYTA2MjVjLWUxMDctNDJhZS05NDRhLTE1ODQyMmFmNWQ5MiJ9.eyJqdGkiOiJmNjhiZWJkOS00Mjc4LTQ4MDgtOTNmMy1iMmU2NDUyMTU2NjEiLCJpc3MiOiJkZXYuaW50ZXJvcC5wYWdvcGEuaXQiLCJhdWQiOiJkZXYuaW50ZXJvcC5wYWdvcGEuaXQvbTJtIiwiY2xpZW50X2lkIjoiNmQ2MWM4NmMtMTUxOS00ZDBhLWIwYzMtOTRkYTVhMzMyNzVhIiwic3ViIjoiNmQ2MWM4NmMtMTUxOS00ZDBhLWIwYzMtOTRkYTVhMzMyNzVhIiwiaWF0IjoxNzYxOTA3NDUzLCJuYmYiOjE3NjE5MDc0NTMsImV4cCI6MTc2MTkzNjI1Mywib3JnYW5pemF0aW9uSWQiOiI2OWUyODY1ZS02NWFiLTRlNDgtYTYzOC0yMDM3YTllZTJlZTciLCJyb2xlIjoibTJtIn0.hn7cyRu9l6mOMKRQ85zGHaRedmcRA5u9Puk7vbM47weioFKNUv5Q1Yh_-UhOJ4t60fhHn3FN6bSefFVNFJwmCuup_4oZ6D-laK93TP1XqMfoKtW-mVvTSb6kgx6MSMjQ70PreEZI82oJgkQqjWs_FdA--VLdKYY3ngLHiwTbsZMoeGZm-gani32A-zSYbo9AZEn2HCt0iXPzIydoqxGoZt3NYpt3ndBRQvXOgEVsaNfk8fD80QVZen1c-GSy9rthitanN9WJqZXqBxgc1U_uUZmDcVJ-bo4if53F3euUPEAwN2VUgd46q0RZQmub1NXWTIqOlOV_UKup-Dn3jYwSOA";

    const response = await this.fetchSignalsBatch(
      baseUrl,
      mockToken,
      eserviceId,
      startSignalId,
      size
    );

    return response.data;
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
      signalId,
      size,
    };

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
  }
}

export const signalHubService = new SignalHubService();
