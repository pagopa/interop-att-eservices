import {
  logger,
  getContext,
  ResidenceSubmissionService,
  translateKeys,
  userModelNotFound,
} from "pdnd-common";
import { RichiestaAR003 } from "../model/domain/models.js";
import { InternalRequestAR003 } from "../model/internal-models.js";
import { REQ_AR003_ITA_TO_ENG } from "../utilities/residence-submission-mapping.js";

class ResidenceSubmissionController {
  public async createUser(
    request: RichiestaAR003
  ): Promise<{ status: string; message: string }> {
    try {
      const internalRequest: InternalRequestAR003 = translateKeys(
        request,
        REQ_AR003_ITA_TO_ENG
      );

      await ResidenceSubmissionService.create(internalRequest);

      return {
        status: "OK",
        message: "Utente creato con successo",
      };
    } catch (error) {
      logger.error(` Error in 'createUser': `, error);
      return {
        status: "KO",
        message: "Errore durante il salvataggio dell'utente.",
      };
    }
  }

  public async updateUser(
    request: RichiestaAR003
  ): Promise<{ status: string; message: string }> {
    try {
      const internalRequest: InternalRequestAR003 = translateKeys(
        request,
        REQ_AR003_ITA_TO_ENG
      );

      await ResidenceSubmissionService.updateBySubjectId(internalRequest);

      return {
        status: "OK",
        message: "Utente aggiornato con successo",
      };
    } catch (error) {
      logger.error(`Error in 'updateUser': `, error);
      throw userModelNotFound(
        "Errore durante l’aggiornamento, utente non trovato"
      );
    }
  }

  public async deleteUser(
    id: string
  ): Promise<{ status: string; message: string }> {
    try {
      await ResidenceSubmissionService.delete(id);

      return {
        status: "OK",
        message: "Utente eliminato con successo",
      };
    } catch (error) {
      logger.error(`Error in 'deleteUser': `, error);
      return {
        status: "KO",
        message: "Errore durante l'eliminazione dell'utente.",
      };
    }
  }
}

export default new ResidenceSubmissionController();
