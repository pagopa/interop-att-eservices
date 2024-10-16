import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { JWTConfig, logger, sendCustomEvent } from "../index.js";
import { AuthData, AuthJWTToken } from "./authData.js";

export const readAuthDataFromJwtToken = (
  jwtToken: string
): AuthData | Error => {
  try {
    const decoded = jwt.decode(jwtToken, { json: true });
    const token = AuthJWTToken.safeParse(decoded);

    if (token.success === false) {
      logger.error(`Error parsing token: ${JSON.stringify(token.error)}`);
      return new Error(token.error.message);
    }
    return {
      purposeId: token.data.purposeId,
      clientId: token.data.client_id,
    };
  } catch (err) {
    // logger.error(`Unexpected error parsing token: ${err}`);
    return new Error(`Unexpected error parsing token: ${err}`);
  }
};

const getKey =
  (
    clients: jwksClient.JwksClient[]
  ): ((header: JwtHeader, callback: SigningKeyCallback) => void) =>
  (header, callback) => {
    for (const { client, last } of clients.map((c, i) => ({
      client: c,
      last: i === clients.length - 1,
    }))) {
      client.getSigningKey(header.kid, function (err, key) {
        if (err && last) {
          logger.error(`Error getting signing key: ${err}`);
          return callback(err, undefined);
        } else {
          return callback(null, key?.getPublicKey());
        }
      });
    }
  };

export const verifyJwtToken = (jwtToken: string): Promise<boolean> => {
  const config = JWTConfig.parse(process.env);
  const clients = !config.skipJWTVerification
    ? config.wellKnownUrls.map((url) =>
        jwksClient({
          jwksUri: url,
        })
      )
    : undefined;
  return clients === undefined
    ? Promise.resolve(true)
    : new Promise((resolve, _reject) => {
        jwt.verify(
          jwtToken,
          getKey(clients),
          undefined,
          function (err, _decoded) {
            if (err) {
              logger.error(`Error verifying token: ${err}`);
              return resolve(false);
            }
            return resolve(true);
          }
        );
      });
};

export const verifyJwtPayloadAndHeader = (
  jwtToken: string,
  operationPath: string,
  operationMethod: string,
  isEnableTrial: boolean
): Promise<boolean> =>
  new Promise((resolve) => {
    const config = JWTConfig.parse(process.env);
    const decodedToken = jwt.decode(jwtToken, { complete: true }) as {
      header: JwtHeader;
      payload: JwtPayload;
    };

    if (!decodedToken?.header) {
      logger.error(
        `verifyJwtPayloadAndHeader - Header in bearer token not present`
      );
      if (isEnableTrial) {
        sendCustomEvent("trialEvent", {
          operationPath,
          operationMethod,
          checkName: "VOUCHER_HEADER_NOT_PRESENT",
        });
      }
      resolve(false);
    }

    if (!decodedToken?.payload) {
      logger.error(
        `verifyJwtPayloadAndHeader - Payload in bearer token not present`
      );
      if (isEnableTrial) {
        sendCustomEvent("trialEvent", {
          operationPath,
          operationMethod,
          checkName: "VOUCHER_PAYLOAD_NOT_PRESENT",
        });
      }
      resolve(false);
    }

    if (decodedToken.header.typ !== config.typValue) {
      logger.error(
        `verifyJwtPayloadAndHeader - Error parsing token typ not valid`
      );
      if (isEnableTrial) {
        sendCustomEvent("trialEvent", {
          operationPath,
          operationMethod,
          checkName: "VOUCHER_TYP_NOT_VALID",
        });
      }
      resolve(false);
    }

    if (decodedToken.payload.iss !== config.issValue) {
      logger.error(
        `verifyJwtPayloadAndHeader - Error parsing token iss not valid`
      );
      if (isEnableTrial) {
        sendCustomEvent("trialEvent", {
          operationPath,
          operationMethod,
          checkName: "VOUCHER_ISS_NOT_VALID",
        });
      }
      resolve(false);
    }

    if (decodedToken.payload.aud !== config.audValue) {
      logger.info(`verifyJwtPayloadAndHeader - decodedToken: ${decodedToken}`);
      logger.error(
        `verifyJwtPayloadAndHeader - Error parsing token aud not valid`
      );
      if (isEnableTrial) {
        sendCustomEvent("trialEvent", {
          operationPath,
          operationMethod,
          checkName: "VOUCHER_AUD_NOT_VALID",
        });
      }
      resolve(false);
    }

    resolve(true);
  });
