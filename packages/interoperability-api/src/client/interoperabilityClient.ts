import path from "path";
import { InteroperabilityConfig } from "pdnd-common";
import axios, { AxiosResponse } from "axios";
import { ErrorHandling } from "pdnd-models";
import { logger } from "pdnd-common";
import { JWK } from "../model/domain/models.js";

export async function getkeyClient(
  token: string,
  kid: string
): Promise<JWK | undefined> {
  const config = InteroperabilityConfig.parse(process.env);

  if (!config.skipInteroperabilityVerification) {
    const apiUrl = path.join(config.host, "keys", kid);
    logger.info(`Interoperability client: url ${apiUrl}`);

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response: AxiosResponse<JWK> = await axios.get(apiUrl, { headers });
      logger.info(`Interoperability client: Response: ${response.data}`);
      logger.info(
        "Interoperability client: get key from Interoperability client: done"
      );
      return response.data;
    } catch (error) {
      logger.error(`Interoperability client: 
      Unexpected error while retrieving the key: ${error}`);
      throw ErrorHandling.tokenGenerationError(
        "Unexpected error while retrieving the key"
      );
    }
  }
  return undefined;
}
