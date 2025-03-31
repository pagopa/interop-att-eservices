import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import ResidenceSubmissionService from "../services/residenceSubmissionService.js";
// import {
//   requestParamNotValid,
//   userModelNotFound,
// } from "../exceptions/errors.js";
import {
  RichiestaAR001,
  RichiestaAR003,
  RispostaAR001,
} from "../model/domain/models.js";
import { requestParamNotValid } from "../exceptions/errors.js";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
// import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
// import { checkInfoSoggettoEquals } from "../utilities/equalsUtilities.js";

class ResidenceSubmissionController {
  public appContext = getContext();

  public async upsertUser(
    request: RichiestaAR003
  ): Promise<{ status: string; message: string }> {
    try {
      logger.info(`PUT upsertUser: ${JSON.stringify(request)}`);

      let data;
      if (request.criteria.subjectId) {
        data = await ResidenceSubmissionService.getBySubjectId(
          request.criteria.subjectId
        );
      } else if (checkPersonalInfo(request)) {
        data = await ResidenceSubmissionService.getByPersonalInfo(
          request.criteria
        );
      } else if (request.criteria.id) {
        data = await ResidenceSubmissionService.getById(request.criteria.id);
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }

      if (data) {
        await dataPreparationRepository.updateById(data.id, request);
      } else {
        await dataPreparationRepository.create(request);
      }

      return {
        status: "OK",
        message: "Residenza caricata correttamente",
      };
    } catch (error) {
      logger.error(` Errore in 'upsertUser': `, error);

      return {
        status: "KO",
        message:
          error.message || "Errore durante il caricamento della residenza",
      };
    }
  }
}

const checkPersonalInfo = (request: RichiestaAR001): boolean =>
  !!request.criteria.name &&
  !!request.criteria.surname &&
  !!request.criteria.birthDate &&
  !!request.criteria.birthDate.eventDate &&
  !!request.criteria.birthDate.birthPlace &&
  !!request.criteria?.birthDate?.birthPlace?.municipality?.nameMunicipality &&
  !!request.criteria?.birthDate?.birthPlace?.place?.codState;

export default new ResidenceSubmissionController();
