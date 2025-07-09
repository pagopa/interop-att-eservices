import { UserModel } from "pdnd-models";
import { logger, getContext, userService } from "pdnd-common";
import { userModelNotFound } from "../exceptions/errors.js";
import {
  RichiestaAR001,
  RichiestaAR002,
  RispostaAR001,
  RispostaAR002OK,
  TipoParametriRicercaAR001,
} from "../model/domain/models.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
import { checkInfoSoggettoEquals } from "../utilities/equalsUtilities.js";

class ResidenceVerificationController {
  public appContext = getContext();

  public async findUser(request: RichiestaAR001): Promise<RispostaAR001> {
    const data = await this.getUserData(request);
    if (data.length === 0) {
      throw userModelNotFound("No user found matching the criteria");
    }
    return {
      idOp: request.operationId,
      subjects: {
        subject: data.map(UserModelToApiTipoDatiSoggettiEnte),
      },
    };
  }

  public async findUserVerify(
    request: RichiestaAR002
  ): Promise<RispostaAR002OK> {
    const data = await this.getUserData(request);
    if (data.length === 0) {
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
  }

  private async getUserData(
    request: RichiestaAR001 | RichiestaAR002
  ): Promise<UserModel[]> {
    try {
      const { subjectId } = request.criteria;

      if (subjectId) {
        return userService
          .getUserBySubjectId(subjectId)
          .then((user) => (user ? [user] : []));
      }

      if (this.checkPersonalInfo(request)) {
        const parametriDiRicerca: TipoParametriRicercaAR001 = request.criteria;

        return userService.getByPersonalInfo(parametriDiRicerca);
      }

      return [];
    } catch (error) {
      logger.error(`Controller Error during getUserData`, error);
      throw error;
    }
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
