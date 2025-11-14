/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from "pdnd-models";
import { mapUserModel } from "../../utility/mapUserModel.js";
import { SubjectRepository } from "../../repositories/residence-verification/index.js";
import { getRotatedSeed, logger } from "../../index.js";

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

  async generateSeed(eServiceId: string): Promise<string> {
    try {
      logger.info(
        `[UserService] Generating rotated seed for eServiceId: ${eServiceId}`
      );
      return getRotatedSeed(eServiceId);
    } catch (error) {
      logger.error(
        `[UserService] Error in generateSeed for eServiceId: ${eServiceId}`,
        error
      );
      throw error;
    }
  },
};
