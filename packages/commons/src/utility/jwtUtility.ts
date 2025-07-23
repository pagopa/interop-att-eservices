import jwt from "jsonwebtoken";
import { ErrorHandling } from "pdnd-models";
import { logger } from "../index.js";

export const verifyJwtTokenUtility = (
  jwtToken: string,
  key: string | Buffer
): Promise<boolean> => {
  logger.info(`verifyJwtToken`);

  return new Promise((resolve, _reject) => {
    jwt.verify(
      jwtToken,
      key,

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

export const getKidFromJWTToken = (token: string): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const decodedToken: jwt.Jwt | null = jwt.decode(token, {
        complete: true,
      });

      if (decodedToken?.header?.kid) {
        resolve(decodedToken.header.kid);
      } else {
        throw ErrorHandling.tokenNotValid();
      }
    } catch (error) {
      logger.error(`Error decoding token: ${error}`);
      reject(error);
    }
  });
