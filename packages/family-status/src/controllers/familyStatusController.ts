import { logger, getContext } from "pdnd-common";
import { FamilyStatusService } from "pdnd-common";
import {
  requestParamNotValid,
  userModelNotFound,
} from "../exceptions/errors.js";
import { RequestFS001, ResponseFS001 } from "../model/domain/models.js";
import { mapDbRecordToResponseFS001 } from "../utilities/mapDbRecordToResponseFS001.js";

class FamilyStatusController {
  public appContext = getContext();

  public async findUser(
    request: RequestFS001
  ): Promise<ResponseFS001 | null | undefined> {
    try {
      logger.info(`[START] findUser: ${JSON.stringify(request.criteria)}`);
      if (request.criteria.subjectId) {
        const data = await FamilyStatusService.verifyBySubjectId(
          request.criteria.subjectId
        );

        if (!data || Object.keys(data).length === 0) {
          throw userModelNotFound();
        }

        return mapDbRecordToResponseFS001(data, request.operationId);
      } else if (checkPersonalInfo(request)) {
        const data = await FamilyStatusService.findByPersonalInfo(
          request.criteria
        );
        if (!data || Object.keys(data).length === 0) {
          throw userModelNotFound();
        }
        const mappedData = mapDbRecordToResponseFS001(
          data[0],
          request.operationId
        );
        logger.info(`[END] findUser: ${request}`);
        return mappedData;
      } else if (request.criteria.id) {
        if (request.criteria.id) {
          const data = await FamilyStatusService.findById(request.criteria.id);
          if (!data || Object.keys(data).length === 0) {
            throw userModelNotFound();
          }
          return mapDbRecordToResponseFS001(data, request.operationId);
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

  public async findUserVerify(request: RequestFS001): Promise<ResponseFS001> {
    try {
      logger.info(`post request: ${request}`);

      if (request.criteria.subjectId) {
        const data = await FamilyStatusService.verifyBySubjectId(
          request.criteria.subjectId
        );
        return mapDbRecordToResponseFS001(data, request.operationId);
      }

      if (checkPersonalInfoVerify(request)) {
        const data = await FamilyStatusService.findByPersonalInfo(
          request.criteria
        );
        const resultData = mapDbRecordToResponseFS001(
          data[0],
          request.operationId
        );

        if (!resultData || resultData.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        return resultData;
      }

      if (request.criteria.id) {
        const data = await FamilyStatusService.findById(request.criteria.id);
        const resultData = mapDbRecordToResponseFS001(
          data,
          request.operationId
        );

        if (!resultData || resultData.subjects?.subject?.length === 0) {
          throw userModelNotFound();
        }
        return resultData;
      }

      throw requestParamNotValid(
        "The request body has one or more required param not valid"
      );
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
