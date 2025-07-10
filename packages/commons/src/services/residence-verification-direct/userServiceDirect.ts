/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from "pdnd-models";
import { logger } from "pdnd-common";
import { mapUserModel } from "../../utility/mapUserModel.js";
import { SubjectRepositoryDirect } from "../../repositories/residence-verification-direct/subjectRepository.js";

export class UserServiceDirect {
  private readonly subjectRepository: SubjectRepositoryDirect;

  constructor() {
    this.subjectRepository = new SubjectRepositoryDirect();
  }

  public async getUserBySubjectId(
    subjectId: string
  ): Promise<UserModel | null> {
    try {
      const result = await this.subjectRepository.findWithAddressBySubjectId(
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
  }

  public async getByPersonalInfo(parametriRicerca: any): Promise<UserModel[]> {
    try {
      const rows = await this.subjectRepository.findWithAddressByPersonalInfo(
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
  }
}
