import { logger, getContext } from "pdnd-common";
import {
  requestParamNotValid,
  userModelNotFound,
} from "../exceptions/errors.js";
import {
  RequestFS001,
  ResponseFS001,
  UserModel,
} from "../model/domain/models.js";
import { UserModelToDataSubjectsInstitution } from "../model/domain/apiConverter.js";
import familyStatusService from "../services/familyStatusService.js";

class FamilyStatusController {
  public appContext = getContext();

  public async findUser(
    request: RequestFS001
  ): Promise<ResponseFS001 | null | undefined> {
    try {
      logger.info(`post request: ${request}`);
      if (request.criteria.fiscalCode) {
        const data = await familyStatusService.getByFiscalCode(
          request.criteria.fiscalCode
        );

        const list: UserModel[] = data ? [data] : [];

        const result: ResponseFS001 = {
          idOp: request.operationId,
          subjects: {
            subject: list.map((element) =>
              UserModelToDataSubjectsInstitution(element)
            ),
          },
        };
        return result;
      } else if (checkPersonalInfo(request)) {
        const data = await familyStatusService.getByPersonalInfo(
          request.criteria
        );

        const result: ResponseFS001 = {
          idOp: request.operationId,
          subjects: {
            subject: data.map((element) =>
              UserModelToDataSubjectsInstitution(element)
            ),
          },
        };

        return result;
      } else if (request.criteria.id) {
        if (request.criteria.id) {
          const data = await familyStatusService.getById(request.criteria.id);

          const list: UserModel[] = data ? [data] : [];

          const result: ResponseFS001 = {
            idOp: request.operationId,
            subjects: {
              subject: list.map((element) =>
                UserModelToDataSubjectsInstitution(element)
              ),
            },
          };
          return result;
        }
        return null;
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }
    } catch (error) {
      logger.error(`Error during in method controller 'findUser': `, error);
      throw error;
    }
  }
  /* eslint-disable */
  public async findUserVerify(request: RequestFS001): Promise<ResponseFS001> {
    try {
      logger.info(`post request: ${request}`);
      let resultData;
      if (request.criteria.fiscalCode) {
        const data = await familyStatusService.getByFiscalCode(
          request.criteria.fiscalCode
        );

        const list: UserModel[] = data ? [data] : [];

        resultData = {
          idOp: request.operationId,
          subjects: {
            subject: list.map((element) =>
              UserModelToDataSubjectsInstitution(element)
            ),
          },
        };
      } else if (checkPersonalInfoVerify(request)) {
        const data = await familyStatusService.getByPersonalInfo(
          request.criteria
        );

        resultData = {
          idOp: request.operationId,
          subjects: {
            subject: data.map((element) =>
              UserModelToDataSubjectsInstitution(element)
            ),
          },
        };
      } else if (request.criteria.id) {
        if (request.criteria.id) {
          const data = await familyStatusService.getById(
            `${request.criteria.id}`
          );

          const list: UserModel[] = data ? [data] : [];

          resultData = {
            idOp: request.operationId,
            subjects: {
              subject: list.map((element) =>
                UserModelToDataSubjectsInstitution(element)
              ),
            },
          };
        }
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }

      const response: ResponseFS001 = {};
      response.idOp = request.operationId;
      if (!resultData || resultData.subjects?.subject?.length === 0) {
        throw userModelNotFound();
      }
      /* eslint-enable */
      return response;
    } catch (error) {
      logger.error(`Error during in method controller 'findUser': `, error);
      throw error;
    }
  }
}

const checkPersonalInfo = (request: RequestFS001): boolean =>
  !!request.criteria.name &&
  !!request.criteria.surname &&
  !!request.criteria.birthDate &&
  !!request.criteria.birthDate.eventDate &&
  !!request.criteria.birthDate.birthPlace &&
  !!request.criteria?.birthDate?.placeOfBirth?.municipality?.nameMunicipality &&
  !!request.criteria?.birthDate?.placeOfBirth?.place?.codState;

const checkPersonalInfoVerify = (request002: RequestFS001): boolean =>
  !!request002.criteria.name &&
  !!request002.criteria.surname &&
  !!request002.criteria.birthDate &&
  !!request002.criteria.birthDate.eventDate &&
  !!request002.criteria.birthDate.placeOfBirth &&
  !!request002.criteria?.birthDate?.placeOfBirth?.municipality
    ?.nameMunicipality &&
  !!request002.criteria?.birthDate?.placeOfBirth?.place?.codState;
export default new FamilyStatusController();
