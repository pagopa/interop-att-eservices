// import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import ResidenceSubmissionService from "../services/residenceSubmissionService.js";
// import {
//   requestParamNotValid,
//   userModelNotFound,
// } from "../exceptions/errors.js";
import {
  RichiestaAR001,
  RispostaAR001,
} from "../model/domain/models.js";
// import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
// import { checkInfoSoggettoEquals } from "../utilities/equalsUtilities.js";

class ResidenceSubmissionController {
  
  public appContext = getContext();

  public async upsertUser(
    request: RichiestaAR001
  ): Promise<RispostaAR001 | null | undefined> {
    try {
      logger.info(`PUT upsertUser: ${request}`);
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
        data = await ResidenceSubmissionService.getById(
          request.criteria.id
        );
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }

      if (data) {
        // Update existing user
        data = await ResidenceSubmissionService.updateById(
          data.id,
          request
        );
      } else {
        // Create new user
        data = await ResidenceSubmissionService.create(
          request
        );
      }

      const list: UserModel[] = data ? [data] : [];

      const result: RispostaAR001 = {
        idOp: request.operationId,
        subjects: {
          subject: list.map((element) =>
            UserModelToApiTipoDatiSoggettiEnte(element)
          ),
        },
      };
      return result;
    } catch (error) {
      logger.error(`Error during in method controller 'upsertUser': `, error);
      throw error;
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
