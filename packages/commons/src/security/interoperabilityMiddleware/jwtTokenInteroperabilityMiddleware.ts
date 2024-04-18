// import { signerConfig } from "../index.js";
import axios, { AxiosResponse } from "axios";
import { TokenResponse } from "pdnd-models";
import { InteroperabilityConfig } from "../../config/index.js";
import {logger} from "../../logging/index.js"

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
    logger.info(`access token: ${response.data.access_token}`);
    logger.info(`generate oauth2Token: done`);

    return response.data.access_token;
  } catch (error) {
    logger.error(`[Error] generate oauth2Token: ${error} `);
    throw error;
  }
}
