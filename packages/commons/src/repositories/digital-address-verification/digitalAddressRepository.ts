import { eq } from "drizzle-orm";
import { ElementDigitalAddressModel } from "pdnd-models";
import { client } from "../../db/postgres/client.js";
import { digitalAddressesTable } from "../../db/schema/digital-address-verification/digital-address.model.js";
import { logger } from "../../index.js";

export class DigitalAddressRepository {
  private readonly db = client;

  public async deleteBySubjectDataResponseId(
    subjectDataResponseId: number
  ): Promise<void> {
    try {
      await this.db
        .delete(digitalAddressesTable)
        .where(
          eq(digitalAddressesTable.subjectDataResponseId, subjectDataResponseId)
        );
    } catch (error) {
      logger.error(
        `[DigitalAddressRepo] Error deleting addresses for SDR ID ${subjectDataResponseId}.`,
        error
      );
      throw error;
    }
  }

  public async insertDigitalAddresses(
    subjectDataResponseId: number,
    digitalAddresses: ElementDigitalAddressModel[]
  ): Promise<void> {
    try {
      if (digitalAddresses.length === 0) {
        return;
      }
      const values = digitalAddresses.map((da) => ({
        subjectDataResponseId,
        address: da.digitalAddress,
        profession: da.profession,
        usageReason: da.information.reason,
        usageEndAt: da.information.endDate
          ? new Date(da.information.endDate)
          : new Date("9999-12-31T23:59:59Z"),
      }));
      await this.db.insert(digitalAddressesTable).values(values);
    } catch (error) {
      logger.error(
        `[DigitalAddressRepo] Error inserting digital addresses for SDR ID ${subjectDataResponseId}.`,
        error
      );
      throw error;
    }
  }
}
