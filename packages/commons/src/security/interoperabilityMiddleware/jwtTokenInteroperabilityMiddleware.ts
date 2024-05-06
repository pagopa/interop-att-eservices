// import { signerConfig } from "../index.js";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { ErrorHandling, TokenResponse } from "pdnd-models";
import { InteroperabilityConfig } from "../../config/index.js";
import { logger } from "../../logging/index.js";

export async function getOauth2Token(
  assertion: string
): Promise<string | undefined> {
  const config = InteroperabilityConfig.parse(process.env);

  if (!config.issuer || !config.tokenGenerateHost) {
    return undefined;
  }

  const data = new URLSearchParams();
  data.append("client_id", config.issuer);
  data.append("client_assertion", assertion);
  data.append(
    "client_assertion_type",
    "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
  );
  data.append("grant_type", "client_credentials");

  try {
    const response: AxiosResponse<TokenResponse> = await axios.post(
      config.tokenGenerateHost,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Stampa la stringa cURL
    const curlCommand = generateCurlCommand(response);
    logger.error(`cURL command: ${curlCommand}`);
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      logger.error(`[Error] generate oauth2Token: ${axiosError.message}`);
      if (axiosError.response) {
        // Stampiamo il codice di stato e il messaggio di errore della risposta
        logger.error(`Response status: ${axiosError.response.status}`);
        logger.error(
          `Response data: ${JSON.stringify(axiosError.response.data)}`
        );

        // Stampa la stringa cURL
        const curlCommand = generateCurlCommand(axiosError.response.config);
        logger.error(`cURL command: ${curlCommand}`);
      }
    } else {
      logger.error(`[Error] generate oauth2Token: ${error}`);
    }
    throw ErrorHandling.genericError();
  }

  function generateCurlCommand(requestConfig: AxiosRequestConfig): string {
    const method = requestConfig.method?.toUpperCase() ?? "GET";
    const url = requestConfig.baseURL
      ? requestConfig.url?.replace(requestConfig.baseURL, "")
      : requestConfig.url;
    const headers = Object.keys(requestConfig.headers ?? {})
      .map((key) => `-H '${key}: ${requestConfig.headers![key]}'`)
      .join(" ");
    const data = requestConfig.data
      ? `--data '${JSON.stringify(requestConfig.data)}'`
      : "";
    return `curl -X ${method} '${url}' ${headers} ${data}`;
  }
}
