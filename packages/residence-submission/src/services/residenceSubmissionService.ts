import { logger } from "pdnd-common";
import { UserModel } from "pdnd-models";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import generateHash from "../utilities/hashUtilities.js";
import {
  findUserModelBySubjectId,
  findUserModelById,
  findUserModelByPersonalInfo,
} from "../utilities/userUtilities.js";
import { TipoParametriRicercaAR001 } from "../model/domain/models.js";
import { userModelNotFound } from "../exceptions/errors.js";

class ResidenceVerificationService {
  public appContext = getContext();

  public async getBySubjectId(subjectId: string): Promise<UserModel | null> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(
        hash,
        this.appContext.authData.purposeId,
      );
      const users = result;
      return findUserModelBySubjectId(users, subjectId);
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error,
      );
      throw error;
    }
  }

  public async getById(id: string): Promise<UserModel | null> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(
        hash,
        this.appContext.authData.purposeId,
      );
      const users = result;
      return findUserModelById(users, id);
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error,
      );
      throw error;
    }
  }

  public async getByPersonalInfo(
    parametriRicerca: TipoParametriRicercaAR001,
  ): Promise<UserModel[]> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(
        hash,
        this.appContext.authData.purposeId,
      );
      const users = result;
      const userModelFound = findUserModelByPersonalInfo(
        users,
        parametriRicerca,
      );
      if (!userModelFound) {
        throw userModelNotFound("Not found");
      }
      return userModelFound;
    } catch (error) {
      logger.error(
        `UserService: Errore durante il salvataggio della lista. `,
        error,
      );
      throw error;
    }
  }
  public async updateById(
    id: string,
    updatedUser: UserModel,
  ): Promise<UserModel | null> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(
        hash,
        this.appContext.authData.purposeId,
      );
      const users = result;

      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw userModelNotFound(`User with id ${id} not found`);
      }

      users[userIndex] = { ...users[userIndex], ...updatedUser };
      await dataPreparationRepository.saveAllByKey(hash, users, users);

      return users[userIndex];
    } catch (error) {
      logger.error(`UserService: Error during user update by id. `, error);
      throw error;
    }
  }

  public async save(newUser: UserModel): Promise<UserModel> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.findAllByKey(
        hash,
        this.appContext.authData.purposeId,
      );
      const users = result || [];

      users.push(newUser);
      await dataPreparationRepository.saveAllByKey(hash, users, users);

      return newUser;
    } catch (error) {
      logger.error(`UserService: Error during user save. `, error);
      throw error;
    }
  }
}

export default new ResidenceVerificationService();
