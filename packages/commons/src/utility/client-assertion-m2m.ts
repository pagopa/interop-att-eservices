/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import axios from "axios";
import { logger, m2mConfig } from "../index.js";

const config = m2mConfig();

export const exec_pdnd_client_assertion_m2m = (private_key: string): string => {
  const issued = Math.floor(Date.now() / 1000);
  const expire_in = issued + 2592000;
  const jti = uuidv4();

  const headers_rsa = {
    kid: config.kid,
    alg: config.alg,
    typ: config.typ,
  };

  const payload = {
    iss: config.clientId,
    sub: config.clientId,
    aud: config.authAudience,
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
  client_assertion: string
): Promise<string | undefined> => {
  const data = {
    client_id: config.clientId,
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion,
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const response = await axios.post(
      config.tokenEndpoint || "https://auth.uat.interop.pagopa.it/token.oauth2",
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
