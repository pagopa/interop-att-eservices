/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
import { userModelNotFound } from "../exceptions/errors.js";
import { RichiestaAR003 } from "../model/domain/models.js";
import {
  mapApiBodyToDbModels,
  mapApiBodyToDbModelsUpdate,
} from "../model/domain/apiConverter.js";
import { Subject } from "../model/db/subjects.model.js";
import { Purpose } from "../model/db/purposes.model.js";
import { Address } from "../model/db/addresses.model.js";
import { Usecase } from "../model/db/usecases.model.js";

class ResidenceSubmissionService {
  public appContext = getContext();

  public async getBySubjectId(subjectId: string): Promise<Usecase[] | null> {
    try {
      if (!subjectId) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const subject = await dataPreparationRepository.findSubjectById(
        subjectId
      );

      if (!subject) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const usecases = await dataPreparationRepository.findUsecasesById(
        subject.uuid
      );

      if (!usecases.length) {
        return null;
      }

      return usecases;
    } catch (error) {
      logger.error("Error in getBySubjectId:", error);
      return [];
    }
  }

  public async updateByUsecasesIdService(updatedUser: any): Promise<void> {
    // TODO: Define more specific type
    try {
      logger.info(`[START] updateBysubjectId`);

      const subjects = updatedUser?.subjects?.subject;

      if (!Array.isArray(subjects)) {
        throw new Error("Missing or invalid 'subjects.subject' array");
      }

      const updatePromises = subjects.map(async (subject: any) => {
        // TODO: Define more specific type
        const id: string = subject?.generality?.subjectId?.subjectId;

        const existingUser = await this.getBySubjectId(id);

        if (!existingUser) {
          throw userModelNotFound(`User with subjectId ${id} not found`);
        }

        const innerPromises = existingUser.map(async (usecase: any) => {
          // TODO: Define more specific type
          const queryData = mapApiBodyToDbModelsUpdate(
            subject,
            usecase.subject_id,
            usecase.address_id
          );

          const sub = queryData.subject;
          const adrs = queryData.address;

          if (!sub || !adrs) {
            throw new Error(
              `Mapping error: Subject or address data is missing for subjectId ${id}.`
            );
          }

          await dataPreparationRepository.updateSubjectById(id, sub as Subject);

          await dataPreparationRepository.updateAddressById(
            usecase.address_id,
            adrs as Address
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

  // TODO: Refactor this method to reduce complexity
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async create(request: RichiestaAR003): Promise<void> {
    try {
      logger.info(`[START] create`);
      if (request.subjects && Array.isArray(request.subjects.subject)) {
        for (const subject of request.subjects.subject) {
          const queryData = mapApiBodyToDbModels(subject);

          const sub = queryData.subject;
          const id = sub?.subject_id;

          const existingUser = await dataPreparationRepository.findSubjectById(
            id as string
          );
          if (existingUser) {
            throw new Error(
              `Mapping error: Subject with subject_id ${sub?.subject_id} already exists. Skipping insert.`
            );
            continue;
          }

          const uscs = queryData.usecases;
          if (!uscs || uscs.length === 0) {
            throw new Error(
              `Mapping error: No usecases found for subject with subject_id ${sub?.subject_id}. Skipping insert.`
            );
          }
          await dataPreparationRepository.createSubject(sub as Subject);
          await dataPreparationRepository.createPurpose(
            queryData.purpose as Purpose
          );
          for (const address of queryData.addresses as Address[]) {
            await dataPreparationRepository.createAddress(address);
          }
          for (const usecase of queryData.usecases as Usecase[]) {
            await dataPreparationRepository.createUsecase(usecase);
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
        subjectId
      );

      if (!subject) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const usecases = await dataPreparationRepository.findUsecasesById(
        subject.uuid
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
