import jwt from "jsonwebtoken"; // , { Algorithm }
import { logger } from "../index.js";

export const verifyJwtTokenUtility = (
  jwtToken: string,
  key: string | Buffer
  // , algorithm: Algorithm = 'RS256'
): Promise<boolean> => {
  logger.info(`verifyJwtToken`);

  return new Promise((resolve, _reject) => {
    jwt.verify(
      jwtToken,
      key,
      // { algorithms: [algorithm] },
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
      // Decodifica il token JWT
      const decodedToken: any = jwt.decode(token, { complete: true });
      // Controlla se il token è stato decodificato correttamente e se l'header contiene il "kid"
      if (decodedToken && decodedToken.header && decodedToken.header.kid) {
        resolve(decodedToken.header.kid);
      }
    } catch (error) {
      logger.error(`Error decoding token: ${error}`);
      reject(error);
    }
  });
