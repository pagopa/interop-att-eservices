/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from "pdnd-models";
import { mapUserModel } from "../../utility/mapUserModel.js";
import { SubjectRepository } from "../../repositories/residence-verification/index.js";
import { logger } from "../../index.js";

const subjectRepository = SubjectRepository;

export const userService = {
  async getUserBySubjectId(subjectId: string): Promise<UserModel | null> {
    try {
      const result = await subjectRepository.findWithAddressBySubjectId(
        subjectId
      );

      if (result.length === 0) {
        return null;
      }

      const { subjects, addresses } = result[0];
      return mapUserModel(subjects.uuid, subjects, addresses);
    } catch (error) {
      logger.error(
        `[UserService] Error in getUserBySubjectId for: ${subjectId}`,
        error
      );
      throw error;
    }
  },

  /**
   * Recupera una lista di utenti tramite i loro dati anagrafici.
   */
  async getByPersonalInfo(parametriRicerca: any): Promise<UserModel[]> {
    try {
      const rows = await subjectRepository.findWithAddressByPersonalInfo(
        parametriRicerca
      );

      if (rows.length === 0) {
        return [];
      }

      return Promise.all(
        rows.map((row) =>
          mapUserModel(row.subjects.uuid, row.subjects, row.addresses)
        )
      );
    } catch (error) {
      logger.error(`[UserService] Error in getByPersonalInfo`, error);
      throw error;
    }
  },
};
