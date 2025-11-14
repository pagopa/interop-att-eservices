/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

export const exec_pdnd_client_assertion_m2m = (private_key: string): string => {
  const issued = Math.floor(Date.now() / 1000);
  const expire_in = issued + 2592000;
  const jti = uuidv4();

  const headers_rsa = {
    kid: process.env.M2M_KID,
    alg: process.env.ALG || "RS256",
    typ: process.env.TYP || "JWT",
  };

  const payload = {
    iss: process.env.M2M_CLIENT_ID,
    sub: process.env.M2M_CLIENT_ID,
    aud: process.env.M2M_AUTH_AUDIENCE,
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
    client_id: process.env.M2M_CLIENT_ID,
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion,
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const response = await axios.post(
      process.env.M2M_TOKEN_ENDPOINT ||
        "https://auth.uat.interop.pagopa.it/token.oauth2",
      data,
      {
        headers,
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    console.error(`Error making POST request: ${error.message}`);
  }
};
