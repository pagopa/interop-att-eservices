import { logger } from "pdnd-common";
import { UserModel } from "pdnd-model";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  findUserModelByFiscalCode,
  findUserModelById
} from "../utilities/userUtilities.js";

class UserService {
  appContext = getContext();

  public async getByFiscalCode(fiscalCode: string): Promise<UserModel | null> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
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
      const hash = generateHash([this.appContext.authData.purposeId]);
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

}

export default new UserService();
