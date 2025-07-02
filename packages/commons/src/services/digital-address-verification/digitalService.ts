import {
  ResponseRequestDigitalAddressModel,
  ElementDigitalAddressModel,
  UsageInfoModel,
} from "pdnd-models";
import { client } from "../../db/postgres/client.js";
import { VerifyRequest } from "../../db/model/verifyRequest.js";
import { logger } from "../../index.js";
import {
  DataPreparationRepository,
  DigitalAddressRepository,
  ListRequestRepository,
  SubjectDataResponseRepository,
  VerificationRequestRepository,
} from "../../repositories/digital-address-verification/index.js";

export class DigitalAddressService {
  private readonly verificationRequestRepo: VerificationRequestRepository;
  private readonly dataPreparationRepo: DataPreparationRepository;
  private readonly listRequestRepo: ListRequestRepository;
  private readonly subjectDataResponseRepo: SubjectDataResponseRepository;
  private readonly digitalAddressRepo: DigitalAddressRepository;

  constructor(
    verificationRequestRepo: VerificationRequestRepository = new VerificationRequestRepository(),
    dataPreparationRepo: DataPreparationRepository = new DataPreparationRepository(),
    listRequestRepo: ListRequestRepository = new ListRequestRepository(),
    subjectDataResponseRepo: SubjectDataResponseRepository = new SubjectDataResponseRepository(),
    digitalAddressRepo: DigitalAddressRepository = new DigitalAddressRepository()
  ) {
    this.verificationRequestRepo = verificationRequestRepo;
    this.dataPreparationRepo = dataPreparationRepo;
    this.listRequestRepo = listRequestRepo;
    this.subjectDataResponseRepo = subjectDataResponseRepo;
    this.digitalAddressRepo = digitalAddressRepo;
  }

  public async saveVerificationRequest(data: VerifyRequest): Promise<void> {
    await this.verificationRequestRepo.save(data);
  }

  public async findVerificationRequestById(
    id: string
  ): Promise<VerifyRequest | null> {
    return await this.verificationRequestRepo.findById(id);
  }

  public async updateVerificationRequest(
    data: Pick<VerifyRequest, "idRequest" | "count">
  ): Promise<void> {
    await this.verificationRequestRepo.update(data);
  }

  public async saveDataPreparationList(
    data: ResponseRequestDigitalAddressModel[]
  ): Promise<string> {
    if (data.length === 0) {
      throw new Error("Cannot save an empty list of data.");
    }

    try {
      await client.transaction(async () => {
        const currentListRequestId: string =
          await this.listRequestRepo.createListRequest();

        for (const item of data) {
          await this.dataPreparationRepo.upsertDataPreparation(item.idSubject);
          await this.listRequestRepo.addRequestSubject(
            currentListRequestId,
            item.idSubject
          );

          const subjectDataResponseIdToUse: number =
            await this.subjectDataResponseRepo.upsert(
              currentListRequestId,
              item
            );

          await this.digitalAddressRepo.deleteBySubjectDataResponseId(
            subjectDataResponseIdToUse
          );
          await this.digitalAddressRepo.insertDigitalAddresses(
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
  }

  public async findAllDataPreparation(): Promise<
    ResponseRequestDigitalAddressModel[] | null
  > {
    try {
      const results = await this.dataPreparationRepo.findAllAggregatedData();

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
  }

  public async findSingleDataPreparationByFiscalCode(
    fiscalCode: string
  ): Promise<ResponseRequestDigitalAddressModel | null> {
    logger.info(
      `[DigitalAddressService] Starting search for fiscal code: ${fiscalCode}`
    );

    try {
      const aggregatedData =
        await this.dataPreparationRepo.findSingleAggregatedDataBySubjectId(
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
  }

  public async deleteAllDataPreparation(): Promise<number> {
    return await this.dataPreparationRepo.deleteAll();
  }

  public async deleteSingleDataPreparationByFiscalCode(
    fiscalCode: string
  ): Promise<number> {
    return await this.dataPreparationRepo.deleteBySubjectId(fiscalCode);
  }
}
