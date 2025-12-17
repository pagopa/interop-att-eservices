/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import axios from "axios";
import { logger } from "../logging/index.js";
import { M2mConfig } from "../config/index.js";

export const exec_pdnd_client_assertion_m2m = (
  private_key: string,
  config: M2mConfig
): string => {
  const issued = Math.floor(Date.now() / 1000);
  const expire_in = issued + 2592000;
  const jti = uuidv4();

  const headers_rsa = {
    kid: config.m2mKid,
    alg: config.m2mAlg,
    typ: config.m2mtTyp,
  };

  const payload = {
    iss: config.m2mClientId,
    sub: config.m2mClientId,
    aud: config.m2mAuthAudience,
    jti,
    iat: issued,
    exp: expire_in,
  };

  return jwt.sign(payload, private_key, {
    algorithm: "RS256",
    header: headers_rsa,
  });
};

export const get_pdnd_token_m2m = async (
  client_assertion: string,
  config: M2mConfig
): Promise<string | undefined> => {
  const data = {
    client_id: config.m2mClientId,
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion,
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const response = await axios.post(
      config.m2mTokenEndpoint ||
        "https://auth.uat.interop.pagopa.it/token.oauth2",
      data,
      {
        headers,
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    logger.error(`Error making POST request: ${error.message}`);
    return undefined;
  }
};
