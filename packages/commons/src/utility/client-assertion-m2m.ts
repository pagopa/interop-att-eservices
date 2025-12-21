/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  KMSClient,
  SignCommand,
  SigningAlgorithmSpec,
} from "@aws-sdk/client-kms";
import { logger } from "../index.js";
import { M2mConfig } from "../config/index.js";

export const exec_pdnd_client_assertion_m2m = async (
  config: M2mConfig
): Promise<string> => {
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

  const encodedHeader = b64UrlEncode(JSON.stringify(headers_rsa));
  const encodedPayload = b64UrlEncode(JSON.stringify(payload));
  const tokenData = `${encodedHeader}.${encodedPayload}`;

  const signCommand = new SignCommand({
    KeyId: config.m2mKmsKid, // KMS Key ID
    Message: new TextEncoder().encode(tokenData),
    SigningAlgorithm: SigningAlgorithmSpec.RSASSA_PKCS1_V1_5_SHA_256,
  });

  const kmsClient = new KMSClient();
  const response = await kmsClient.send(signCommand);
  if (!response.Signature) {
    throw Error("JWT Signature failed. Empty signature returned");
  }

  const jwtSignature = b64ByteUrlEncode(response.Signature);

  return `${tokenData}.${jwtSignature}`;
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

const b64UrlEncode = (str: string): string =>
  bufferB64UrlEncode(Buffer.from(str, "utf-8"));

const bufferB64UrlEncode = (b: Buffer): string =>
  b
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const b64ByteUrlEncode = (b: Uint8Array): string =>
  bufferB64UrlEncode(Buffer.from(b));
