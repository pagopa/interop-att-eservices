import { flattenPayload } from "../../zod/family-status/flattenPayload.js";
import {
  insertFamilyStatusSchema,
  type InsertFamilyStatus,
  type SelectFamilyStatus,
} from "../../zod/family-status/family-status.js";
import { familyStatusRepo } from "../../repositories/family-status/family-status.js";
import { RawPayload } from "../../types/rawPayload.js";

export const FamilyStatusService = {
  async prepareData(payload: RawPayload): Promise<object> {
    const flat: InsertFamilyStatus = flattenPayload(payload);

    insertFamilyStatusSchema.parse(flat);

    return await familyStatusRepo.upsert(flat);
  },

  /**
   * Verifica i dati esistenti per un dato subjectId (codice fiscale).
   * Utile per confrontare i dati locali con quelli esposti da un e-service.
   */
  async verifyBySubjectId(
    subjectId: string
  ): Promise<SelectFamilyStatus | undefined> {
    return await familyStatusRepo.findBySubjectId(subjectId);
  },
};
