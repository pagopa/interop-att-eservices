import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

export const exec_pdnd_client_assertion = (
  tracking_jwt_digest: string,
  private_key: string
): string => {
  const issued = Math.floor(Date.now() / 1000);
  const expire_in = issued + 2592000;
  const jti = uuidv4();

  const headers_rsa = {
    kid: process.env.KID,
    alg: process.env.ALG || "RS256",
    typ: process.env.TYP || "JWT",
  };

  const payload = {
    iss: process.env.CLIENT_ID,
    sub: process.env.CLIENT_ID,
    aud: process.env.AUTH_AUDIENCE,
    purposeId: process.env.PURPOSE_ID,
    jti: jti,
    iat: issued,
    exp: expire_in,
    digest: {
      alg: "SHA256",
      value: tracking_jwt_digest,
    },
  };

  return jwt.sign(payload, private_key, {
    algorithm: "RS256",
    header: headers_rsa,
  });
};

export const get_pdnd_token = async (
  client_assertion: string
): Promise<string | undefined> => {
  const data = {
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: client_assertion,
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const response = await axios.post(
      process.env.TOKEN_ENDPOINT ||
        "https://auth.uat.interop.pagopa.it/token.oauth2",
      data,
      {
        headers,
      }
    );
    const access_token = response.data.access_token;
    return access_token;
    console.log("Response:", response.data); // Risposta dell'API
  } catch (error: any) {
    console.error(`Error making POST request: ${error.message}`);
  }
};
