import {
  ResponseRequestDigitalAddressModel,
  ElementDigitalAddressModel,
  UsageInfoModel,
} from "pdnd-models";
import { client } from "../../db/postgres/client.js";
import { VerifyRequest } from "../../db/model/verifyRequest.js";
import { logger } from "../../index.js";

import { VerificationRequestRepository } from "../../repositories/digital-address-verification/verificationRequestRepository.js";
import { DataPreparationRepository } from "../../repositories/digital-address-verification/dataPreparationRepository.js";
import { ListRequestRepository } from "../../repositories/digital-address-verification/listRequestRepository.js";
import { SubjectDataResponseRepository } from "../../repositories/digital-address-verification/subjectDataResponseRepository.js";
import { DigitalAddressRepository } from "../../repositories/digital-address-verification/digitalAddressRepository.js";

const verificationRequestRepo = VerificationRequestRepository;
const dataPreparationRepo = DataPreparationRepository;
const listRequestRepo = ListRequestRepository;
const subjectDataResponseRepo = SubjectDataResponseRepository;
const digitalAddressRepo = DigitalAddressRepository;

export const digitalAddressService = {
  async saveVerificationRequest(data: VerifyRequest): Promise<void> {
    await verificationRequestRepo.save(data);
  },

  async findVerificationRequestById(id: string): Promise<VerifyRequest | null> {
    return await verificationRequestRepo.findById(id);
  },

  async updateVerificationRequest(
    data: Pick<VerifyRequest, "idRequest" | "count">
  ): Promise<void> {
    await verificationRequestRepo.update(data);
  },

  async saveDataPreparationList(
    data: ResponseRequestDigitalAddressModel[]
  ): Promise<string> {
    if (data.length === 0) {
      throw new Error("Cannot save an empty list of data.");
    }

    try {
      await client.transaction(async () => {
        const currentListRequestId: string =
          await listRequestRepo.createListRequest();

        for (const item of data) {
          await dataPreparationRepo.upsertDataPreparation(item.idSubject);
          await listRequestRepo.addRequestSubject(
            currentListRequestId,
            item.idSubject
          );

          const subjectDataResponseIdToUse: number =
            await subjectDataResponseRepo.upsert(currentListRequestId, item);

          await digitalAddressRepo.deleteBySubjectDataResponseId(
            subjectDataResponseIdToUse
          );
          await digitalAddressRepo.insertDigitalAddresses(
            subjectDataResponseIdToUse,
            item.digitalAddress
          );
        }
      });

      return "Data preparation list saved successfully.";
    } catch (error) {
      logger.error(
        `[DigitalAddressService] Error during saveDataPreparationList.`,
        error
      );
      throw error;
    }
  },

  async findAllDataPreparation(): Promise<
    ResponseRequestDigitalAddressModel[] | null
  > {
    try {
      const results = await dataPreparationRepo.findAllAggregatedData();

      if (results.length === 0) {
        return null;
      }
      const groupedData = new Map<string, ResponseRequestDigitalAddressModel>();

      for (const row of results) {
        const {
          idSubject,
          from,
          digitalAddressId,
          digitalAddressAddress,
          digitalAddressProfession,
          digitalAddressUsageReason,
          digitalAddressUsageEndAt,
          subjectDataResponseId,
        } = row;

        if (!idSubject || !from || !subjectDataResponseId) {
          continue;
        }

        const subjectEntry: ResponseRequestDigitalAddressModel =
          groupedData.get(idSubject) ??
          ((): ResponseRequestDigitalAddressModel => {
            const entry: ResponseRequestDigitalAddressModel = {
              idSubject,
              from: from.toISOString(),
              digitalAddress: [],
            };
            groupedData.set(idSubject, entry);
            return entry;
          })();

        if (
          digitalAddressId !== null &&
          digitalAddressAddress !== null &&
          digitalAddressUsageReason !== null
        ) {
          const usageInfo: UsageInfoModel = {
            reason: digitalAddressUsageReason,
            endDate: digitalAddressUsageEndAt
              ? digitalAddressUsageEndAt.toISOString()
              : "9999-12-31T23:59:59.000Z",
          };
          const elementDigitalAddress: ElementDigitalAddressModel = {
            digitalAddress: digitalAddressAddress,
            profession: digitalAddressProfession ?? undefined,
            information: usageInfo,
          };
          groupedData.set(idSubject, {
            ...subjectEntry,
            digitalAddress: [
              ...subjectEntry.digitalAddress,
              elementDigitalAddress,
            ],
          });
        }
      }

      return Array.from(groupedData.values());
    } catch (error) {
      logger.error(
        `[DigitalAddressService] Error during findAllDataPreparation.`,
        error
      );
      throw error;
    }
  },

  async findSingleDataPreparationByFiscalCode(
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    logger.info(
      `[DigitalAddressService] Starting search for fiscal code: ${fiscalCode}`
    );

    try {
      const aggregatedData =
        await dataPreparationRepo.findSingleAggregatedDataBySubjectId(
          fiscalCode
        );

      if (!aggregatedData) {
        logger.info(
          `[DigitalAddressService] No data response found for fiscal code: ${fiscalCode}. Returning null.`
        );
        return null;
      }

      const { subjectDataResponseRow, digitalAddressesResult } = aggregatedData;

      const digitalAddressModels: ElementDigitalAddressModel[] =
        digitalAddressesResult.map((dg) => ({
          digitalAddress: dg.address,
          profession: dg.profession ?? "",
          information: {
            reason: dg.usageReason,
            endDate: dg.usageEndAt
              ? dg.usageEndAt.toISOString()
              : "9999-12-31T23:59:59.000Z",
          },
        }));
      logger.info(
        `[DigitalAddressService] Mapped ${digitalAddressModels.length} digital addresses.`
      );

      const finalResult: ResponseRequestDigitalAddressModel = {
        idSubject: subjectDataResponseRow.subjectId,
        from: subjectDataResponseRow.dataFrom.toISOString(),
        digitalAddress: digitalAddressModels,
      };
      logger.info(
        `[DigitalAddressService] Final data prepared for fiscal code ${fiscalCode}.`
      );

      return finalResult;
    } catch (error) {
      logger.error(
        `[DigitalAddressService] Error during findSingleDataPreparationByFiscalCode for fiscal code '${fiscalCode}'.`,
        error
      );
      throw error;
    } finally {
      logger.info(
        `[DigitalAddressService] Finished executing findSingleDataPreparationByFiscalCode for fiscal code: ${fiscalCode}`
      );
    }
  },

  async deleteAllDataPreparation(): Promise<number> {
    return await dataPreparationRepo.deleteAll();
  },

  async deleteSingleDataPreparationByFiscalCode(
    fiscalCode: string
  ): Promise<number> {
    return await dataPreparationRepo.deleteBySubjectId(fiscalCode);
  },
};
