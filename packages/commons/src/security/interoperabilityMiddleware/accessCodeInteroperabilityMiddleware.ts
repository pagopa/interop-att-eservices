import {
  TokenPayloadInternal,
  buildInteropTokenGenerator as buildInteropAccessCodeGenerator,
} from "../../auth/index.js";
import { InternalToken, TokenHeader } from "../../auth/index.js";
import { InteroperabilityConfig, SignerConfig } from "../../config/index.js";
import { logger } from "../../logging/index.js";

export const generateInternalAccessCode = async (
  kid: string,
  configSigner: SignerConfig,
  config: InteroperabilityConfig
): Promise<InternalToken | null> => {
  try {
    const tokenGenerator = buildInteropAccessCodeGenerator(configSigner);
    if (!config.skipInteroperabilityVerification) {
      const tokenPayloadSeed: TokenPayloadInternal = {
        subject: config.subject,
        audience: config.audience,
        tokenIssuer: config.issuer,
        expirationInSeconds: parseInt(config.expirationInSeconds, 10),
      };
      const jwtHeaders: TokenHeader = {
        alg: "RS256",
        kid,
        typ: "JWT",
      };
      if (tokenPayloadSeed !== undefined) {
        const internalToken = await tokenGenerator.generateInternalToken(
          tokenPayloadSeed,
          jwtHeaders
        );
        logger.info(`generate InternalAccessCode: done`);
        return internalToken;
      }
      return null;
    }
    return null;
  } catch (error) {
    logger.error(`
    An error occurred while generating the access token: ${error}`);
    throw error;
  }
};
