/* eslint-disable max-params */
import { Algorithm, JwtPayload } from "jsonwebtoken";
import { ErrorHandling } from "pdnd-model";
import { v4 as uuidv4 } from "uuid";
import { signerConfig } from "../../config/index.js";
import { logger } from "../../logging/index.js";
import { userRoles } from "../authData.js";
import { buildSignerService } from "../../aws-kms/signerService.js";
import { InternalToken, TokenPayload, TokenPayloadInternal, TokenHeader} from "./token.js";

export type InteropTokenGenerator = {
  generateInternalToken: (seed: TokenPayloadInternal, header: TokenHeader) => Promise<InternalToken>;
};

const createInternalToken = (
  algorithm: Algorithm,
  kid: string,
  subject: string,
  audience: string,
  tokenIssuer: string,
  validityDurationSeconds: number
): TokenPayload => {
  const issuedAt = new Date().getTime() / 1000;
  const expireAt = validityDurationSeconds + issuedAt;

  return {
    id: uuidv4(),
    algorithm,
    kid,
    subject,
    issuer: tokenIssuer,
    issuedAt,
    nbf: issuedAt,
    expireAt,
    audience,
    customClaims: new Map([["role", userRoles.INTERNAL_ROLE]])
  };
};

export const buildInteropTokenGenerator = (): InteropTokenGenerator => {
  // Hosting all the dependencies to collect all process env reading at one time
  const signerService = buildSignerService();
  const config = signerConfig();

  const createSignedJWT = async (
    seed: TokenPayload,
    jwtHeaders: TokenHeader
  ): Promise<string> => {
    const customHeaders = {
      // use: "sig"
    };
 
    const headers = { ...jwtHeaders, ...customHeaders };

    const payload: JwtPayload = {
      ...seed.customClaims,
      jti: seed.id,
      iss: seed.issuer,
      aud: seed.audience,
      sub: seed.subject,
      iat: seed.issuedAt,
      nbf: seed.nbf,
      exp: seed.expireAt
    };

    const encodedHeader = Buffer.from(JSON.stringify(headers)).toString(
      "base64url"
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url"
    );
    const serializedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = await signerService.signWithRSA256(config.kmsKeyId, serializedToken);

    logger.info(`Interop internal Token generated`);
    return `${serializedToken}.${signature}`;
  };

  const generateInternalToken = async (
    tokenPayloadSeed: TokenPayloadInternal,
    tokenHeader: TokenHeader
  ): Promise<InternalToken> => {
    try {
    
      const tokenSeed = createInternalToken(
        tokenHeader.alg,//"RS256",
        tokenHeader.kid,
        tokenPayloadSeed.subject,
        tokenPayloadSeed.audience,
        tokenPayloadSeed.tokenIssuer,
        tokenPayloadSeed.expirationInSeconds
      );

      const signedJwt = await createSignedJWT(tokenSeed, tokenHeader);

      return {
        serialized: signedJwt,
        jti: tokenSeed.id,
        iat: tokenSeed.issuedAt,
        exp: tokenSeed.expireAt,
        nbf: tokenSeed.nbf,
        expIn: tokenPayloadSeed.expirationInSeconds,
        alg: tokenHeader.alg,
        kid: tokenHeader.kid,
        aud: tokenSeed.audience,
        sub: tokenSeed.subject,
        iss: tokenSeed.issuer
      };
    } catch (error) {
      throw ErrorHandling.tokenGenerationError(error);
    }
  };

  return {
    generateInternalToken,
  };
};
