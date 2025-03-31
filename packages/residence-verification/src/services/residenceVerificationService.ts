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
      const result = await dataPreparationRepository.findAllByKey(hash);
      const users = result;
      return findUserModelBySubjectId(users, subjectId);
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

  public async getByPersonalInfo(
    parametriRicerca: TipoParametriRicercaAR001
  ): Promise<UserModel[]> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
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

  public async createUser(user: UserModel): Promise<UserModel> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const result = await dataPreparationRepository.save(hash, user);
      return result;
    } catch (error) {
      logger.error(
        `UserService: Errore durante la creazione dell'utente. `,
        error
      );
      throw error;
    }
  }

  public async updateUser(user: UserModel): Promise<UserModel> {
    try {
      const hash = generateHash([this.appContext.authData.purposeId]);
      const existingUsers = await dataPreparationRepository.findAllByKey(hash);
      const existingUser = findUserModelById(existingUsers, user.id);

      if (!existingUser) {
        throw userModelNotFound(`User with id ${user.id} not found`);
      }

      const updatedUser = { ...existingUser, ...user };
      await dataPreparationRepository.update(hash, updatedUser);
      return updatedUser;
    } catch (error) {
      logger.error(
        `UserService: Errore durante l'aggiornamento dell'utente. `,
        error
      );
      throw error;
    }
  }
}

export default new ResidenceVerificationService();
