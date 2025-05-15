import { logger, getContext } from "pdnd-common";
import ResidenceSubmissionService from "../services/residenceSubmissionService.js";
import { RichiestaAR003 } from "../model/domain/models.js";
import { requestParamNotValid } from "../exceptions/errors.js";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";

class ResidenceSubmissionController {
  public appContext = getContext();

  public async upsertUser(
    request: RichiestaAR003
  ): Promise<{ status: string; message: string }> {
    try {
      // TODO: controllare se sia il caso di loggare questi dati
      logger.info("resquest: ", JSON.stringify(request));
      logger.info(`PUT upsertUser: ${JSON.stringify(request)}`);

      console.log("request.instanceof", request.instanceof);

      const subjectId = getSubjectId(request);

      if (!subjectId) {
        throw requestParamNotValid("The subjectId is missing or invalid");
      }

      if (request.subjects && Array.isArray(request.subjects.subject)) {
        await Promise.all(
          request.subjects.subject.map(async (subject) => {
            const subjectId = subject?.generality?.subjectId?.subjectId; // TODO: da gestire il tipo di subjectId

            if (!subjectId) {
              throw requestParamNotValid("The subjectId is missing or invalid");
            }

            const data = await ResidenceSubmissionService.getBySubjectId(
              subjectId,
            );

            if (data) {
              // Aggiorna il record esistente
              await dataPreparationRepository.updateSubjectByUuid(
                data.uuid,
                subject,
              );
            } else {
              await dataPreparationRepository.createSubject(subject);
            }
          }),
        );
      }

      return {
        status: "OK",
        message: "Residenza caricata correttamente",
      };
    } catch (error) {
      logger.error(` Errore in 'upsertUser': `, error);
      return {
        status: "KO",
        message: "Errore durante il caricamento della residenza",
      };
    }
  }
}

const getSubjectId = (request: RichiestaAR003): string | undefined => {
  if (
    request &&
    request.subjects &&
    Array.isArray(request.subjects.subject) &&
    request.subjects.subject.length > 0 &&
    request.subjects.subject[0]?.generality?.subjectId?.subjectId
  ) {
    return request.subjects.subject[0].generality.subjectId.subjectId;
  }
  return undefined;
};

export default new ResidenceSubmissionController();
