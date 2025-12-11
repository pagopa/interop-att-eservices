/* eslint-disable @typescript-eslint/no-explicit-any */
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
      logger.info(`[residence-submission][START] getBySubjectId: ${subjectId}`);

      if (!subjectId) {
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      const subject = await DataPreparationRepository.findSubjectById(
        subjectId
      );
      if (!subject) {
        logger.warn(`[DEBUG] Subject not found in DB for ID: ${subjectId}`);
        throw userModelNotFound("The subjectId is missing or invalid");
      }

      logger.info(`[residence-submission][END] getBySubjectId - Found`);
      return subject;
    } catch (error) {
      logger.error(`[residence-submission] Error in getBySubjectId`, error);
      throw error;
    }
  },

  async updateBySubjectId(updatedUser: RequestAR003Type): Promise<void> {
    try {
      logger.info(`[residence-submission][START] updateBySubjectId`);

      logger.info(
        `[DEBUG UPDATE] RAW INPUT: ${JSON.stringify(updatedUser, null, 2)}`
      );

      const id =
        updatedUser.subjects?.subject?.generality?.subjectId?.subjectId;

      logger.info(`[DEBUG UPDATE] Extracted Subject ID (CF): ${id}`);

      if (!id) {
        throw new Error("Subject ID missing in update request");
      }

      await this.getBySubjectId(id);

      const mappedResult = mapApiBodyToDbModelsUpdate(updatedUser);
      const { subject: updatedSubject, address: updatedAddress } = mappedResult;

      logger.info(
        `[DEBUG UPDATE] Mapped Subject Object: ${JSON.stringify(
          updatedSubject,
          null,
          2
        )}`
      );
      logger.info(
        `[DEBUG UPDATE] Mapped Address Object: ${JSON.stringify(
          updatedAddress,
          null,
          2
        )}`
      );

      logger.info(
        `[DEBUG UPDATE] Calling Repo updateSubjectById with ID: ${id}`
      );
      await DataPreparationRepository.updateSubjectById(
        id,
        updatedSubject as unknown as Subject
      );

      if (updatedAddress && Object.keys(updatedAddress).length > 0) {
        logger.info(
          `[DEBUG UPDATE] Address data present, proceeding to update address.`
        );

        const existingAddresses =
          await DataPreparationRepository.findAddressesBySubjectId(id);

        if (existingAddresses && existingAddresses.length > 0) {
          logger.info(
            `[DEBUG UPDATE] Found existing addresses for ${id}. Updating using ID (CF).`
          );

          const today = new Date().toISOString().split("T")[0];

          const addressToUpdate = {
            ...updatedAddress,
            address_start_date: today,
          };

          logger.info(`[DEBUG UPDATE] Setting new address date to: ${today}`);

          await DataPreparationRepository.updateAddressById(
            id,
            addressToUpdate as unknown as Address
          );
        } else {
          logger.warn(
            `[DEBUG UPDATE] No existing address found in DB for subject ${id}. Skipping address update.`
          );
        }
      } else {
        logger.info(
          `[DEBUG UPDATE] No address data to update (updatedAddress is empty).`
        );
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

      logger.info(
        `[DEBUG CREATE] RAW REQUEST: ${JSON.stringify(request, null, 2)}`
      );

      const subjectData = request.subjects?.subject;

      logger.info(
        `[DEBUG CREATE] Extracted subjects.subject: ${JSON.stringify(
          subjectData,
          null,
          2
        )}`
      );

      if (!subjectData) {
        throw new Error("Missing 'subjects.subject' data in the request.");
      }

      logger.info(`[DEBUG CREATE] Calling mapApiBodyToDbModels...`);
      const { subject: newSubject, address: newAddress } =
        mapApiBodyToDbModels(request);

      logger.info(
        `[DEBUG CREATE] MAPPED DB SUBJECT: ${JSON.stringify(
          newSubject,
          null,
          2
        )}`
      );
      logger.info(
        `[DEBUG CREATE] MAPPED DB ADDRESS: ${JSON.stringify(
          newAddress,
          null,
          2
        )}`
      );

      if (!newSubject) {
        throw new Error("Subject data is missing after mapping.");
      }

      logger.info(
        `[DEBUG CREATE] Checking existence for Subject ID: ${newSubject.subject_id}`
      );
      const existingSubject = await DataPreparationRepository.findSubjectById(
        newSubject.subject_id
      );

      if (existingSubject) {
        logger.error(
          `[DEBUG CREATE] Subject already exists: ${JSON.stringify(
            existingSubject
          )}`
        );
        throw new Error(
          `Subject with subject_id ${newSubject.subject_id} already exists.`
        );
      }

      logger.info(`[DEBUG CREATE] Calling Repo createSubject...`);
      await DataPreparationRepository.createSubject(newSubject);

      if (newAddress) {
        const today = new Date().toISOString().split("T")[0];

        const addressToSave = {
          ...newAddress,
          address_start_date: today,
        };
        logger.info(`[DEBUG CREATE] Calling Repo createAddress...`);
        await DataPreparationRepository.createAddress(
          addressToSave as unknown as Address
        );
      } else {
        logger.warn(
          `[DEBUG CREATE] No address mapped, skipping createAddress.`
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
      logger.info(
        `[residence-submission][START] deleteBySubjectId: ${subjectId}`
      );

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
        logger.info(`[DEBUG DELETE] Deleting ${addresses.length} addresses.`);
        await Promise.all(
          addresses.map((address) =>
            DataPreparationRepository.deleteAddressById(address.id)
          )
        );
      }

      logger.info(`[DEBUG DELETE] Deleting subject.`);
      await DataPreparationRepository.deleteSubjectById(subjectId);

      logger.info(`[residence-submission][END] deleteBySubjectId`);
    } catch (error) {
      logger.error(`[residence-submission] Error during delete`, error);
      throw error;
    }
  },
};
