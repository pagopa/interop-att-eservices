import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import { findFiscalcodeModelByFiscalcode } from "../utilities/fiscalcodeUtilities.js";
import { VerificaCodiceFiscale } from "../model/domain/models.js";
import { fiscalcodeModelToVerificaCodiceFiscale } from "../model/domain/apiConverter.js";

class FiscalcodeVerificationService {
  public appContext = getContext();
  public eService: string = "fiscalcode-verification";

  public async getByFiscalCode(
    fiscalCode: string
  ): Promise<VerificaCodiceFiscale | null> {
    try {
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const result = await dataPreparationRepository.findAllByKey(hash);
      const fiscaldodes = result;
      const found = findFiscalcodeModelByFiscalcode(fiscaldodes, fiscalCode);
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
