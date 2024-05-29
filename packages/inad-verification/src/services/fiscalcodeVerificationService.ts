import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import { VerifyRequest } from "../model/inad/VerifyRequest.js";
import { findRequestlByIdRequest } from "../utilities/verifyRequestUtilities.js";

class FiscalcodeVerificationService {
  public appContext = getContext();
  public eService: string = "fiscalcode-verification";

  public async getByIdRequest(
    fiscalCode: string
  ): Promise<VerifyRequest | null> {
    try {
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const result = await dataPreparationRepository.findAllByKey(hash);
      const fiscaldodes = result;
      const found = findRequestlByIdRequest(fiscaldodes, fiscalCode);
      if (found) {
        return fiscalcodeModelToVerificaCodiceFiscale(
          found,
          true,
          "Codice fiscale valido"
        );
      } else {
        return fiscalcodeModelToVerificaCodiceFiscale(
          found,
          false,
          "Codice fiscale non valido",
          fiscalCode
        );
      }
    } catch (error) {
      logger.error(
        `fiscalcodeService: Errore durante il recupero dell'utente dal codice fiscale. `,
        error
      );
      throw error;
    }
  }
}

export default new FiscalcodeVerificationService();
