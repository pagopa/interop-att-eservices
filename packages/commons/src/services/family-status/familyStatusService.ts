import { flattenPayload } from "../../zod/family-status/flattenPayload.js";
import {
  insertFamilyStatusSchema,
  type InsertFamilyStatus,
  type SelectFamilyStatus,
} from "../../zod/family-status/family-status.js";
import { familyStatusRepo } from "../../repositories/family-status/family-status.js";
import { RawPayload } from "../../types/rawPayload.js";
import { FamilyStatusDto } from "../../types/familyStatusDTO.js";

export const FamilyStatusService = {
  async prepareData(payload: RawPayload): Promise<object> {
    const flat: InsertFamilyStatus = flattenPayload(payload);

    insertFamilyStatusSchema.parse(flat);

    return await familyStatusRepo.upsert(flat);
  },

  async getAll(): Promise<FamilyStatusDto[]> {
    return await familyStatusRepo.findAll();
  },

  async getByUUID(uuid: string): Promise<FamilyStatusDto> {
    return await familyStatusRepo.findByUUID(uuid);
  },

  async deleteAll(): Promise<number> {
    return await familyStatusRepo.deleteAll();
  },

  async deleteByUUID(uuid: string): Promise<void> {
    return await familyStatusRepo.deleteByUUID(uuid);
  },

  async verifyBySubjectId(
    subjectId: string
  ): Promise<SelectFamilyStatus | undefined> {
    return await familyStatusRepo.findBySubjectId(subjectId);
  },
};
