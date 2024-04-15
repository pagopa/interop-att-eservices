import { TokenPayloadInternal, buildInteropTokenGenerator as buildInteropAccessCodeGenerator } from "../../auth/index.js"
import {  InternalToken, TokenHeader } from "../../auth/index.js";
import { InteroperabilityConfig } from "../../config/index.js";

export const generateAndLogInternalAccessCode = async (kid: string): Promise<InternalToken | null> => {
  try {
      const tokenGenerator = buildInteropAccessCodeGenerator();
      const config = InteroperabilityConfig.parse(process.env);
      
      if (!config.skipInteroperabilityVerification) {
          const tokenPayloadSeed : TokenPayloadInternal= {
              subject: config.subject,
              audience: config.audience,
              tokenIssuer: config.issuer,
              expirationInSeconds: parseInt(config.expirationInSeconds) // Durata di validità del token in secondi
          };
          const jwtHeaders: TokenHeader = {
            alg: "RS256",
            kid: kid,
            typ: "JWT",
          }; 
          if (tokenPayloadSeed != undefined) {
            const internalToken = await tokenGenerator.generateInternalToken(tokenPayloadSeed, jwtHeaders);
            console.log('Token interno generato:', internalToken);
            return internalToken; // Restituisce il token interno generato
          }
          return null;
      }
      
      return null;
  } catch (error) {
      console.error('Si è verificato un errore durante la generazione del token:', error);
      // Gestisci gli errori di generazione del token
      throw error; // Lanciare l'errore per la gestione esterna, se necessario
  }
};
