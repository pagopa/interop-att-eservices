/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import {
  KMSClient,
  SignCommand,
  SigningAlgorithmSpec,
} from "@aws-sdk/client-kms";
import { M2mConfig } from "../config/index.js";

export const get_pdnd_token_m2m = async (
  config: M2mConfig
): Promise<string> => {
  const issued = Math.floor(Date.now() / 1000);
  const expire_in = issued + 2592000;
  const jti = uuidv4();

  const headers_rsa = {
    kid: config.m2mKmsKid,
    alg: config.m2mAlg,
    typ: config.m2mtTyp,
  };

  const payload = {
    iss: config.m2mClientId,
    sub: config.m2mClientId,
    client_id: config.m2mClientId,
    aud: config.m2mAuthAudience,
    jti,
    iat: issued,
    nbf: issued,
    exp: expire_in,
    organizationId: config.m2mOrgId,
    role: config.m2mRole,
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
