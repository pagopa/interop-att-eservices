//import { ByKid } from "../model/types.js";
import axios, { AxiosResponse } from "axios";
import { JWK } from "../model/domain/models.js";
import { InteroperabilityConfig } from "pdnd-common";
import path from "path";
import { ErrorHandling } from "pdnd-models";

export async function getkeyClient(
  token: string,
  kid: string
): Promise<JWK | undefined> {
  console.log("call getKeyData:");
  const config = InteroperabilityConfig.parse(process.env);

  // Definisci l'URL dell'API utilizzando il token fornito e il kid specificato
  if (!config.skipInteroperabilityVerification) {
    const apiUrl = path.join(config.host, "keys", kid);
    console.log("api url ", apiUrl);
    // Configura gli header della richiesta
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // Effettua la chiamata usando axios
      const response: AxiosResponse<JWK> = await axios.get(apiUrl, { headers });
      console.log("Risposta:", response.data);
      return response.data;
    } catch (error) {
      console.error("Unexpected error during token generation:", error);
      throw ErrorHandling.tokenGenerationError("Errore durante la generazione del token");
    }
  }
  return undefined;
}
