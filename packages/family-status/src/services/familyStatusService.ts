import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  findUserModelByFiscalCode,
  findUserModelById,
  findUserModelByPersonalInfo,
} from "../utilities/userUtilities.js";
import { userModelNotFound } from "../exceptions/errors.js";
import { CriteriaTypeFS001, UserModel } from "../model/domain/models.js";

class ResidenceVerificationService {
  public appContext = getContext();
  public eService: string = "family-status";

  public async getByFiscalCode(fiscalCode: string): Promise<UserModel | null> {
    try {
      const hash = generateHash([this.eService, this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(hash);
      const users = result;
      return findUserModelByFiscalCode(users, fiscalCode);
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error
      );
      throw error;
    }
  }

  public async getById(id: string): Promise<UserModel | null> {
    try {
      const hash = generateHash([this.eService, this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(hash);
      const users = result;
      return findUserModelById(users, id);
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error
      );
      throw error;
    }
  }

  public async getByPersonalInfo(
    parametriRicerca: CriteriaTypeFS001
  ): Promise<UserModel[]> {
    try {
      const hash = generateHash([this.eService, this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(hash);
      const users = result;
      const userModelFound = findUserModelByPersonalInfo(
        users,
        parametriRicerca
      );
      if (!userModelFound) {
        throw userModelNotFound("Not found");
      }
      return userModelFound;
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error
      );
      throw error;
    }
  }
}

export default new ResidenceVerificationService();
