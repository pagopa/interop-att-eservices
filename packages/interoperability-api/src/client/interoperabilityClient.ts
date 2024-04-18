// import { ByKid } from "../model/types.js";
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

  // Definisci l'URL dell'API utilizzando il token fornito e il kid specificato
  if (!config.skipInteroperabilityVerification) {
    const apiUrl = path.join(config.host, "keys", kid);
    logger.info(`Interoperability client: url ${apiUrl}`);

    // Configura gli header della richiesta
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // Effettua la chiamata usando axios
      const response: AxiosResponse<JWK> = await axios.get(apiUrl, { headers });
      logger.info(`Interoperability client: Response: ${response.data}`);
      logger.info("Interoperability client: get key from Interoperability client: done");
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
