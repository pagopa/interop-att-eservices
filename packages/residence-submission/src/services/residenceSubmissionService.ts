import { logger } from "pdnd-common";
import { UserModel } from "pdnd-models";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import { userModelNotFound } from "../exceptions/errors.js";


// TODO: da aggiungere il mapping qui
class ResidenceSubmissionService {
  public appContext = getContext();

  public async getBySubjectId(subjectId: string): Promise<UserModel | null> {
    try {
      logger.info(`[START] getBySubjectId`);
      const user = await dataPreparationRepository.findByUuid(subjectId);
      if (!user) {
        throw userModelNotFound(`User with subjectId ${subjectId} not found`);
      }
      logger.info(`[END] getBySubjectId`);
      return user;
    } catch (error) {
      logger.error(`Error during getBySubjectId.`, error);
      throw error;
    }
  }

  public async getById(id: string): Promise<UserModel | null> {
    try {
      logger.info(`[START] getById`);
      const user = await dataPreparationRepository.findByUuid(id);
      if (!user) {
        throw userModelNotFound(`User with id ${id} not found`);
      }
      logger.info(`[END] getById`);
      return user;
    } catch (error) {
      logger.error(`Error during getById.`, error);
      throw error;
    }
  }

  public async updateById(
    id: string,
    updatedUser: UserModel
  ): Promise<UserModel | null> {
    try {
      logger.info(`[START] updateById`);
      const existingUser = await this.getById(id);
      if (!existingUser) {
        throw userModelNotFound(`User with id ${id} not found`);
      }

      await dataPreparationRepository.updateSubjectByUuid(id, updatedUser);

      logger.info(`[END] updateById`);
      return { ...existingUser, ...updatedUser };
    } catch (error) {
      logger.error(`Error during updateById.`, error);
      throw error;
    }
  }

  // public async save(newUser: UserModel): Promise<UserModel> {
  //   try {
  //     logger.info(`[START] save`);
  //     const id = newUser.id || this.generateUuid();
  //     await dataPreparationRepository.createSubject(id, newUser);
  //     logger.info(`[END] save`);
  //     return { ...newUser, id };
  //   } catch (error) {
  //     logger.error(`Error during save.`, error);
  //     throw error;
  //   }
  // }

  // Genera un UUID
  // private generateUuid(): string {
  //   return crypto.randomUUID();
  // }
}

export default new ResidenceSubmissionService();
