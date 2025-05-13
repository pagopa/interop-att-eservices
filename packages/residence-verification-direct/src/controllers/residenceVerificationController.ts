import { UserModel } from "pdnd-models";
import { logger, getContext } from "pdnd-common";
import {
  getById,
  getByPersonalInfo,
  getUserBySubjectId,
} from "../services/residenceVerificationService.js";
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

  /**
   * Find users based on the provided criteria.
   */
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

  /**
   * Verifies a user by comparing provided info with stored data.
   */
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
            checkInfoSoggettoEquals(request.check?.address, user)
          ),
        },
      };
    } catch (error) {
      logger.error(`Error in 'findUserVerify': `, error);
      throw error;
    }
  }

  /**
   * Retrieves user data and adds geolocation coordinates.
   */
  private async getUserData(
    request: RichiestaAR001 | RichiestaAR002
  ): Promise<UserModel[] | undefined> {
    const { subjectId, id } = request.criteria;
    try {
      logger.info(`id ${JSON.stringify(id)}`);
      logger.info(`subjectId ${JSON.stringify(subjectId)}`);

      if (subjectId) {
        return this.fetchAndUpdateUser(getUserBySubjectId(subjectId));
      }

      if (this.checkPersonalInfo(request)) {
        const users = await getByPersonalInfo(request.criteria);
        return Promise.all(users.map(this.getUpdatedUserModel.bind(this)));
      }

      if (id) {
        return this.fetchAndUpdateUser(getById(`${id}`));
      }
    } catch (error) {
      logger.error(`Error retrieving user data: ${JSON.stringify(error)}`);
    }
    return undefined;
  }

  /**
   * Fetches a single user and updates their address with coordinates.
   */
  private async fetchAndUpdateUser(
    fetchUser: Promise<UserModel | null>
  ): Promise<UserModel[] | undefined> {
    const user = await fetchUser;
    return user ? [await this.getUpdatedUserModel(user)] : [];
  }

  /**
   * Builds a full address string from the user model.
   */
  private getFullAddress(data: UserModel): string {
    const address = data?.address?.address;
    return address
      ? `${address.toponym?.toponymDenomination} ${address.civicNumber?.civicNumber}, ${address.municipality?.nameMunicipality}, ${address.municipality?.acronymIstatProvince}, ${address.cap}`
      : "";
  }

  /**
   * Updates the user model with geolocation coordinates based on address.
   */
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

  /**
   * Checks if the request contains valid personal info for matching.
   */
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
