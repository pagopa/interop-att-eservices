import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import ResidenceVerificationService from "../services/residenceVerificationService.js";
import {
  requestParamNotValid,
  userModelNotFound,
} from "../exceptions/errors.js";
import {
  RichiestaAR001,
  RichiestaAR002,
  RispostaAR001,
  RispostaAR002OK,
} from "../model/domain/models.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
import { checkInfoSoggettoEquals } from "../utilities/equalsUtilities.js";

class ResidenceVerificationController {
  public appContext = getContext();

  public async findUser(
    request: RichiestaAR001
  ): Promise<RispostaAR001 | null | undefined> {
    try {
      logger.info(`post request: ${request}`);
      if (request.criteria.fiscalCode) {
        const data = await ResidenceVerificationService.getByFiscalCode(
          request.criteria.fiscalCode
        );

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
      } else if (checkPersonalInfo(request)) {
        const data = await ResidenceVerificationService.getByPersonalInfo(
          request.criteria
        );

        const result: RispostaAR001 = {
          idOp: request.operationId,
          subjects: {
            subject: data.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };

        return result;
      } else if (request.criteria.id) {
        if (request.criteria.id) {
          const data = await ResidenceVerificationService.getById(
            request.criteria.id
          );

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
  public async findUserVerify(
    request: RichiestaAR002
  ): Promise<RispostaAR002OK> {
    try {
      logger.info(`post request: ${request}`);
      let resultData;
      if (request.criteria.fiscalCode) {
        const data = await ResidenceVerificationService.getByFiscalCode(
          request.criteria.fiscalCode
        );

        const list: UserModel[] = data ? [data] : [];

        resultData = {
          idOp: request.operationId,
          subjects: {
            subject: list.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };
      } else if (checkPersonalInfoVerify(request)) {
        const data = await ResidenceVerificationService.getByPersonalInfo(
          request.criteria
        );

        resultData = {
          idOp: request.operationId,
          subjects: {
            subject: data.map((element) =>
              UserModelToApiTipoDatiSoggettiEnte(element)
            ),
          },
        };
      } else if (request.criteria.id) {
        if (request.criteria.id) {
          const data = await ResidenceVerificationService.getById(
            `${request.criteria.id}`
          );

          const list: UserModel[] = data ? [data] : [];

          resultData = {
            idOp: request.operationId,
            subjects: {
              subject: list.map((element) =>
                UserModelToApiTipoDatiSoggettiEnte(element)
              ),
            },
          };
        }
      } else {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }

      const response: RispostaAR002OK = {};
      response.idOp = request.operationId;
      if (!resultData || resultData.subjects?.subject?.length === 0) {
        throw userModelNotFound();
      } else {
        // vado a vedere se qualcuno ha la residenza richiesta in oggetto
        response.subjects = { infoSubject: [] };
        resultData?.subjects?.subject.forEach((oggetto) => {
          oggetto.address?.forEach((address) => {
            response.subjects?.infoSubject?.push(
              checkInfoSoggettoEquals(request.check?.address, address)
            );
          });
        });
      }
      /* eslint-enable */
      return response;
    } catch (error) {
      logger.error(`Error during in method controller 'findUser': `, error);
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

const checkPersonalInfoVerify = (request: RichiestaAR002): boolean =>
  !!request.criteria.name &&
  !!request.criteria.surname &&
  !!request.criteria.birthDate &&
  !!request.criteria.birthDate.eventDate &&
  !!request.criteria.birthDate.birthPlace &&
  !!request.criteria?.birthDate?.birthPlace?.municipality?.nameMunicipality &&
  !!request.criteria?.birthDate?.birthPlace?.place?.codState;
export default new ResidenceVerificationController();
