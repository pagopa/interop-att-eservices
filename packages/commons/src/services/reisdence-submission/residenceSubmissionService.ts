import { z } from "zod";
import { RequestAR003 } from "../../zod/residence-submission/requestAR003.js";
import { Subject } from "../../db/schema/residence-verification/subject.model.js";
import { logger } from "../../index.js";
import { userModelNotFound } from "../../logging/index.js";
import { DataPreparationRepository } from "../../repositories/residence-submission/dataPreparation.js";
import {
  mapApiBodyToDbModels,
  mapApiBodyToDbModelsUpdate,
} from "../../utility/mapRequestAr003.js";

type RequestAR003Type = z.infer<typeof RequestAR003>;

export const ResidenceSubmissionService = {
  async getBySubjectId(subjectId: string): Promise<Subject> {
    try {
      logger.info(`[residence-submission][START] getBySubjectId`);

      if (!subjectId) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const subject = await DataPreparationRepository.findSubjectById(
        subjectId
      );
      if (!subject) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      logger.info(`[residence-submission][END] getBySubjectId`);
      return subject;
    } catch (error) {
      logger.error(`[residence-submission] Error in getBySubjectId`, error);
      throw error;
    }
  },

  async updateBySubjectId(updatedUser: RequestAR003Type): Promise<void> {
    try {
      logger.info(`[residence-submission][START] updateBySubjectId`);

      const subjects = updatedUser?.subjects?.subject;
      if (!Array.isArray(subjects)) {
        throw new Error("Missing or invalid 'subjects.subject' array");
      }

      for (const subject of subjects) {
        const id: string = subject?.generality?.subjectId?.subjectId;

        const existingSubject = await this.getBySubjectId(id);
        if (!existingSubject) {
          throw userModelNotFound(`User with subjectId ${id} not found`);
        }

        const queryData = mapApiBodyToDbModelsUpdate(updatedUser);
        const updatedSubject = queryData.subject;
        const updatedAddresses = queryData.addresses;

        if (!updatedSubject || !updatedAddresses) {
          throw new Error(`Mapping error for subjectId ${id}.`);
        }

        await DataPreparationRepository.updateSubjectById(id, updatedSubject);

        const existingAddresses =
          await DataPreparationRepository.findAddressesBySubjectId(id);
        logger.info(`existingAddresses: ${JSON.stringify(existingAddresses)}`);
        const existingAddressIds = existingAddresses.map(
          (addr) => addr.subject_id
        );
        logger.info(
          `existingAddressIds: ${JSON.stringify(existingAddressIds)}`
        );
        for (const address of updatedAddresses) {
          logger.info(`address id: ${address.subject_id}`);
          logger.info(
            `condition subject_id: ${
              address.subject_id &&
              existingAddressIds.includes(address.subject_id)
            }`
          );
          if (
            address.subject_id &&
            existingAddressIds.includes(address.subject_id)
          ) {
            await DataPreparationRepository.updateAddressById(
              address.subject_id,
              address
            );
          }
        }
      }

      logger.info(`[residence-submission][END] updateBySubjectId`);
    } catch (error) {
      logger.error(
        `[residence-submission] Error during updateBySubjectId`,
        error
      );
      throw error;
    }
  },

  async create(request: RequestAR003Type): Promise<void> {
    try {
      logger.info(`[residence-submission][START] create`);

      if (request.subjects && Array.isArray(request.subjects.subject)) {
        for (const subject of request.subjects.subject) {
          const queryData = mapApiBodyToDbModels(subject);
          const newSubject = queryData.subject;
          const newAddresses = queryData.addresses;

          if (!newSubject || !newAddresses || newAddresses.length === 0) {
            throw new Error(
              "Subject or at least one address is missing in the request."
            );
          }

          const existingSubject =
            await DataPreparationRepository.findSubjectById(
              newSubject.subject_id
            );
          if (existingSubject) {
            throw new Error(
              `Subject with subject_id ${newSubject.subject_id} already exists.`
            );
          }

          await DataPreparationRepository.createSubject(newSubject);

          for (const address of newAddresses) {
            await DataPreparationRepository.createAddress({
              ...address,
              subject_id: newSubject.subject_id,
            });
          }
        }
      }

      logger.info(`[residence-submission][END] create`);
    } catch (error) {
      logger.error(`[residence-submission] Error during create`, error);
      throw error;
    }
  },

  async delete(subjectId: string): Promise<void> {
    try {
      logger.info(`[residence-submission][START] deleteBySubjectId`);

      if (!subjectId) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const subject = await DataPreparationRepository.findSubjectById(
        subjectId
      );
      if (!subject) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const addresses =
        await DataPreparationRepository.findAddressesBySubjectId(subjectId);
      for (const address of addresses) {
        await DataPreparationRepository.deleteAddressById(address.id);
      }

      await DataPreparationRepository.deleteSubjectById(subjectId);

      logger.info(`[residence-submission][END] deleteBySubjectId`);
    } catch (error) {
      logger.error(`[residence-submission] Error during delete`, error);
      throw error;
    }
  },
};
