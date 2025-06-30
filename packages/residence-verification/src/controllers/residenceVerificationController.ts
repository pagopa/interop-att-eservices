import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import {
  getById,
  getByPersonalInfo,
  getUserBySubjectId,
} from "../services/residenceVerificationService.js";
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
      const data = await this.getUserData(request);

      if (!data || data.length === 0) {
        throw requestParamNotValid(
          "The request body has one or more required param not valid"
        );
      }

      return {
        idOp: request.operationId,
        subjects: {
          subject: data.map(UserModelToApiTipoDatiSoggettiEnte),
        },
      };
    } catch (error) {
      logger.error(`Error in 'findUser': `, error);
      throw error;
    }
  }

  public async findUserVerify(
    request: RichiestaAR002
  ): Promise<RispostaAR002OK> {
    try {
      const data = await this.getUserData(request);

      if (!data || data.length === 0) {
        throw userModelNotFound();
      }

      return {
        idOp: request.operationId,
        subjects: {
          infoSubject: data.map((user) =>
            checkInfoSoggettoEquals(request.check?.address, user)
          ),
        },
      };
    } catch (error) {
      logger.error(`Error in 'findUserVerify': `, error);
      throw error;
    }
  }

  private async getUserData(
    request: RichiestaAR001 | RichiestaAR002
  ): Promise<UserModel[] | undefined> {
    const { subjectId, id } = request.criteria;
    try {
      if (subjectId) {
        const user = await getUserBySubjectId(subjectId);
        return user ? [user] : [];
      }

      if (this.checkPersonalInfo(request)) {
        return getByPersonalInfo(request.criteria);
      }

      if (id) {
        const user = await getById(`${id}`);
        return user ? [user] : [];
      }

      return [];
    } catch (error) {
      logger.error(`Error retrieving user data: ${JSON.stringify(error)}`);
    }
    return undefined;
  }

  private checkPersonalInfo(request: RichiestaAR001 | RichiestaAR002): boolean {
    const birthDate = request.criteria.birthDate;
    return (
      !!request.criteria.name &&
      !!request.criteria.surname &&
      !!birthDate?.eventDate &&
      !!birthDate?.birthPlace?.municipality?.nameMunicipality &&
      !!birthDate?.birthPlace?.place?.codState
    );
  }
}

export default new ResidenceVerificationController();
