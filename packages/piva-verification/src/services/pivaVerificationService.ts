import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import { findPivaModelByPiva } from "../utilities/pivaUtilities.js";
import { VerificaPartitaIva } from "../model/domain/models.js";
import { partitaIvaModelToVerificaPartitaIva } from "../model/domain/apiConverter.js";

class PivaVerificationService {
  public appContext = getContext();
  public eService: string = "piva-verification";

  public async getByPiva(
    partitaIva: string 
  ): Promise<VerificaPartitaIva | null> {
    try {
      const hash = generateHash([
        this.eService,
        this.appContext.authData.purposeId,
      ]);
      const result = await dataPreparationRepository.findAllByKey(hash);
      const pivas = result;
      const found = findPivaModelByPiva(pivas, partitaIva);
      if (found) {
        return partitaIvaModelToVerificaPartitaIva(
          found,
          true,
          "partitaIva valido"
        );
      } else {
        return partitaIvaModelToVerificaPartitaIva(
          found,
          false,
          "partitaIva non valido",
          partitaIva
        );
      }
    } catch (error) {
      logger.error(
        `PartitaIva service: Errore durante il recupero della partitaIva. `,
        error
      );
      throw error;
    }
  }
}

export default new PivaVerificationService();
