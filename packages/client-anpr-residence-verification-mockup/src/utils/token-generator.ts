/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const headers = {
  alg: process.env.ALG || "RS256",
  typ: process.env.TYP || "JWT",
  kid: process.env.KID,
};

const now = Math.floor(Date.now() / 1000);
const exp = now + 60 * 60;

export const generate_agid_jwt_signature_integrity = (
  digest_header: string,
  private_key: string
): string | undefined => {
  try {
    const signature_payload = {
      iss: process.env.CLIENT_ID,
      aud: process.env.ESERVICE_AUDIENCE,
      sub: process.env.USERID,
      iat: now,
      exp,
      jti: uuidv4(),
      signed_headers: {
        digest: digest_header,
        "content-type": "application/json",
        "content-encoding": "identity",
      },
    };

    if (!private_key) {
      throw new Error("private_key not defined");
    }
    const signature_jwt = jwt.sign(signature_payload, private_key, {
      algorithm: "RS256",
      header: headers,
    });

    if (!signature_jwt) {
      throw new Error("Error generating the integrity token");
    }
    return signature_jwt;
  } catch (error: any) {
    console.log(`Error generating integrity token: ${error.message()}`);
  }
};

export const generate_agid_jwt_trackingevidence_audit = (
  private_key: string
): string => {
  const tracking_payload = {
    jti: uuidv4(),
    userID: process.env.USERID,
    userLocation: process.env.LOCATIONID,
    LoA: process.env.LOA,
    aud: process.env.ESERVICE_AUDIENCE,
    iss: process.env.CLIENT_ID,
    clientId: process.env.CLIENT_ID,
    purposeId: process.env.PURPOSE_ID,
    dnonce: now * 1000,
    iat: now,
    exp,
  };
  return jwt.sign(tracking_payload, private_key, {
    algorithm: "RS256",
    header: headers,
  });
};
