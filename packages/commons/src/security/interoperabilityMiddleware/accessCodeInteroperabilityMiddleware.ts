import {
  TokenPayloadInternal,
  buildInteropTokenGenerator as buildInteropAccessCodeGenerator,
} from "../../auth/index.js";
import { InternalToken, TokenHeader } from "../../auth/index.js";
import { InteroperabilityConfig } from "../../config/index.js";
import {logger } from "../../logging/index.js"

export const generateAndLogInternalAccessCode = async (
  kid: string
): Promise<InternalToken | null> => {
  try {
    logger.info(`[START] generateAndLog InternalAccessCode`);

    const tokenGenerator = buildInteropAccessCodeGenerator();
    const config = InteroperabilityConfig.parse(process.env);

    if (!config.skipInteroperabilityVerification) {
      const tokenPayloadSeed: TokenPayloadInternal = {
        subject: config.subject,
        audience: config.audience,
        tokenIssuer: config.issuer,
        expirationInSeconds: parseInt(config.expirationInSeconds), // Durata di validità del token in secondi
      };
      const jwtHeaders: TokenHeader = {
        alg: "RS256",
        kid,
        typ: "JWT",
      };
      if (tokenPayloadSeed != undefined) {
        const internalToken = await tokenGenerator.generateInternalToken(
          tokenPayloadSeed,
          jwtHeaders
        );
        logger.info(`Access code: ${internalToken}`);
        logger.info(`[END] generateAndLog InternalAccessCode`);

        return internalToken; // Restituisce il token interno generato
      }
      return null;
    }

    return null;
  } catch (error) {
    logger.error(`
    An error occurred while generating the access token: ${error}`);
    // Gestisci gli errori di generazione del token
    throw error; // Lanciare l'errore per la gestione esterna, se necessario
  }
};
