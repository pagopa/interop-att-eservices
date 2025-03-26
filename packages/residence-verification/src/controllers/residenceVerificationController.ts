import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import ResidenceVerificationService from "../services/residenceVerificationService.js";
import CoordinatesService from "../services/coordinateService.js";
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
      logger.info(`Post findUser: ${JSON.stringify(request)}`);
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
      logger.info(`Post findUserVerify: ${JSON.stringify(request)}`);
      const data = await this.getUserData(request);

      if (!data || data.length === 0) {
        throw userModelNotFound();
      }

      return {
        idOp: request.operationId,
        subjects: {
          infoSubject: data.map((user) =>
            checkInfoSoggettoEquals(
              request.check?.address,
              user.address.address.coords
            )
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

    if (subjectId) {
      return this.fetchAndUpdateUser(
        ResidenceVerificationService.getBySubjectId(subjectId)
      );
    }

    if (this.checkPersonalInfo(request)) {
      const users = await ResidenceVerificationService.getByPersonalInfo(
        request.criteria
      );
      return Promise.all(users.map(this.getUpdatedUserModel.bind(this)));
    }

    if (id) {
      return this.fetchAndUpdateUser(
        ResidenceVerificationService.getById(`${id}`)
      );
    }

    return undefined;
  }

  private async fetchAndUpdateUser(
    fetchUser: Promise<UserModel | null>
  ): Promise<UserModel[] | undefined> {
    const user = await fetchUser;
    return user ? [await this.getUpdatedUserModel(user)] : [];
  }

  private getFullAddress(data: UserModel): string {
    return data
      ? `${data.address.address.toponym?.toponymDenomination} ${data.address.address.civicNumber?.civicNumber}, ${data.address.address.municipality?.nameMunicipality}, ${data.address.address.municipality?.acronymIstatProvince}, ${data.address.address.cap}`
      : "";
  }

  private async getUpdatedUserModel(user: UserModel): Promise<UserModel> {
    const fullAddress = this.getFullAddress(user);
    const coordinates = await CoordinatesService.getCoordinates(fullAddress);
    return {
      ...user,
      address: {
        ...user.address,
        address: {
          ...user.address.address,
          coords: coordinates,
        },
      },
    };
  }

  private checkPersonalInfo(request: RichiestaAR001 | RichiestaAR002): boolean {
    return (
      !!request.criteria.name &&
      !!request.criteria.surname &&
      !!request.criteria.birthDate?.eventDate &&
      !!request.criteria.birthDate?.birthPlace?.municipality
        ?.nameMunicipality &&
      !!request.criteria.birthDate?.birthPlace?.place?.codState
    );
  }
}

export default new ResidenceVerificationController();
