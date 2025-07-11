import { FiscalcodeModel } from "pdnd-models";
import { eq } from "drizzle-orm";
import { client, logger } from "pdnd-common";
import { fiscalCodes } from "../../db/schema/fiscal-code-verification/index.js";

class FiscalCodeRepository {
  public async findByFiscalCode(
    fiscalCode: string
  ): Promise<FiscalcodeModel | null> {
    logger.info(
      `FiscalCodeVerificationRepository: Searching for fiscal code: ${fiscalCode}`
    );

    const result = await client
      .select({ fiscalCode: fiscalCodes.fiscalCode })
      .from(fiscalCodes)
      .where(eq(fiscalCodes.fiscalCode, fiscalCode))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }
  public async save(model: FiscalcodeModel): Promise<FiscalcodeModel> {
    const result = await client
      .insert(fiscalCodes)
      .values({
        fiscalCode: model.fiscalCode,
      })
      .onConflictDoUpdate({
        target: fiscalCodes.fiscalCode,
        set: {
          updatedAt: new Date(),
        },
      })
      .returning();

    logger.info(
      `FiscalCodeRepository: Record salvato/aggiornato: ${model.fiscalCode}`
    );
    return result[0];
  }

  public async findAll(): Promise<FiscalcodeModel[]> {
    return await client
      .select({ fiscalCode: fiscalCodes.fiscalCode })
      .from(fiscalCodes);
  }

  public async deleteAll(): Promise<number> {
    const result = await client
      .delete(fiscalCodes)
      .returning({ deletedId: fiscalCodes.id });
    logger.info(`FiscalCodeRepository: Cancellati ${result.length} record.`);
    return result.length;
  }
  public async deleteByFiscalCode(fiscalCode: string): Promise<number> {
    const result = await client
      .delete(fiscalCodes)
      .where(eq(fiscalCodes.fiscalCode, fiscalCode))
      .returning({ deletedId: fiscalCodes.id });
    if (result.length > 0) {
      logger.info(`FiscalCodeRepository: Record cancellato: ${fiscalCode}`);
    }
    return result.length;
  }
}

export default new FiscalCodeRepository();
