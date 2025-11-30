import { z } from "zod";
import { RequestAR003 } from "../../zod/residence-submission/requestAR003.js";
import { Subject } from "../../db/schema/residence-verification/subject.model.js";
import { Address } from "../../db/schema/residence-verification/address.model.js";
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

      const id =
        updatedUser.subjects?.subject?.generality?.subjectId?.subjectId;

      if (!id) {
        throw new Error("Subject ID missing in update request");
      }

      await this.getBySubjectId(id);

      const { subject: updatedSubject, address: updatedAddress } =
        mapApiBodyToDbModelsUpdate(updatedUser);

      await DataPreparationRepository.updateSubjectById(
        id,
        updatedSubject as unknown as Subject
      );

      if (updatedAddress && Object.keys(updatedAddress).length > 0) {
        const existingAddresses =
          await DataPreparationRepository.findAddressesBySubjectId(id);

        if (existingAddresses && existingAddresses.length > 0) {
          await DataPreparationRepository.updateAddressById(
            id,
            updatedAddress as unknown as Address
          );
        } else {
          logger.warn(`No existing address found for subject ${id} to update.`);
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

      const subjectData = request.subjects?.subject;
      if (!subjectData) {
        throw new Error("Missing 'subjects.subject' data in the request.");
      }

      const { subject: newSubject, address: newAddress } =
        mapApiBodyToDbModels(request);

      if (!newSubject) {
        throw new Error("Subject data is missing after mapping.");
      }

      const existingSubject = await DataPreparationRepository.findSubjectById(
        newSubject.subject_id
      );
      if (existingSubject) {
        throw new Error(
          `Subject with subject_id ${newSubject.subject_id} already exists.`
        );
      }

      await DataPreparationRepository.createSubject(newSubject);

      if (newAddress) {
        await DataPreparationRepository.createAddress(
          newAddress as unknown as Address
        );
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

      if (addresses && addresses.length > 0) {
        await Promise.all(
          addresses.map((address) =>
            DataPreparationRepository.deleteAddressById(address.id)
          )
        );
      }

      await DataPreparationRepository.deleteSubjectById(subjectId);

      logger.info(`[residence-submission][END] deleteBySubjectId`);
    } catch (error) {
      logger.error(`[residence-submission] Error during delete`, error);
      throw error;
    }
  },
};
