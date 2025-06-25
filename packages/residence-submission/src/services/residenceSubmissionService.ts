import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import { userModelNotFound } from "../exceptions/errors.js";
import { RichiestaAR003 } from "../model/domain/models.js";
import {
  mapApiBodyToDbModels,
  mapApiBodyToDbModelsUpdate,
} from "../model/domain/apiConverter.js";

class ResidenceSubmissionService {
  public appContext = getContext();

  public async getBySubjectId(subjectId: string): Promise<any> {
    try {
      if (!subjectId) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const subject = await dataPreparationRepository.findSubjectById(
        subjectId,
      );      

      if (!subject) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const usecases = await dataPreparationRepository.findUsecasesById(
        subject.uuid,
      );

      if (!usecases.length) {
        return null;
      }

      return usecases;
    } catch (error) {
      logger.error("Error in getBySubjectId:", error);
      return "";
    }
  }

  public async updateByUsecasesIdService(updatedUser: any): Promise<void> {
    try {
      logger.info(`[START] updateBysubjectId`);
  
      const subjects = updatedUser?.subjects?.subject;
  
      if (!Array.isArray(subjects)) {
        throw new Error("Missing or invalid 'subjects.subject' array");
      }
  
      const updatePromises = subjects.map(async (subject: any) => {
        const id = subject?.generality?.subjectId?.subjectId;
  
        if (!id) {
          logger.warn("subjectId missing, skipping subject");
          return;
        }
  
        const existingUser = await this.getBySubjectId(id);
  
        if (!existingUser) {
          throw userModelNotFound(`User with subjectId ${id} not found`);
        }
  
        const innerPromises = existingUser.map(async (usecase: any) => {
          const queryData = mapApiBodyToDbModelsUpdate(
            subject,
            usecase.subject_id,
            usecase.address_id
          );
  
          await dataPreparationRepository.updateSubjectById(
            id,
            queryData.subject
          );
  
          await dataPreparationRepository.updateAddressById(
            usecase.address_id,
            queryData.address
          );
        });
  
        await Promise.all(innerPromises);
      });
  
      await Promise.all(updatePromises);
  
      logger.info(`[END] updateById`);
    } catch (error) {
      logger.error(`Error during updateById.`, error);
      throw error;
    }
  }

  public async create(request: RichiestaAR003): Promise<void> {
    try {
      logger.info(`[START] create`);
      if (request.subjects && Array.isArray(request.subjects.subject)) {
        for (const subject of request.subjects.subject) {
          let queryData = mapApiBodyToDbModels(subject);
          const existingUser = await dataPreparationRepository.findSubjectById(
            queryData.subject.subject_id,
          );
          if (existingUser) {
            logger.warn(
              `Subject with subject_id ${queryData.subject.subject_id} already exists. Skipping insert.`,
            );
            continue;
          }
          if (
            queryData?.subject &&
            queryData?.addresses &&
            queryData?.purpose &&
            queryData?.usecases
          ) {
            await dataPreparationRepository.createSubject(queryData.subject);
            await dataPreparationRepository.createPurpose(queryData.purpose);
            for (const address of queryData.addresses) {
              await dataPreparationRepository.createAddress(address);
            }
            for (const usecase of queryData.usecases) {
              await dataPreparationRepository.createUsecase(usecase);
            }
          }
        }
      }
      logger.info(`[END] create`);
    } catch (error) {
      logger.error(`Error during create.`, error);
      throw error;
    }
  }

  public async delete(subjectId: string): Promise<void> {
    try {
      logger.info(`[START] deleteBySubjectId`);
      
      if (!subjectId) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const subject = await dataPreparationRepository.findSubjectById(
        subjectId,
      );

      if (!subject) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const usecases = await dataPreparationRepository.findUsecasesById(
        subject.uuid,
      );

      if (!usecases.length) {
        logger.warn(`No usecases found for subjectId ${subjectId}`);
        return;
      }

      for (const usecase of usecases) {
        await dataPreparationRepository.deleteUsecaseById(usecase.id);
        await dataPreparationRepository.deleteSubjectById(subjectId);
        await dataPreparationRepository.deleteAddressById(usecase.address_id);
        await dataPreparationRepository.deletePurposeById(usecase.purpose_id);
      }

      logger.info(`[END] deleteBySubjectId`);
    } catch (error) {
      logger.error(`Error during deleteBySubjectId.`, error);
      throw error;
    }
  }
}

export default new ResidenceSubmissionService();
