import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const EServiceId = z.string().uuid().brand("EServiceId");
export type EServiceId = z.infer<typeof EServiceId>;

export const EServiceDocumentId = z.string().uuid().brand("EServiceDocumentId");
export type EServiceDocumentId = z.infer<typeof EServiceDocumentId>;

export const AgreementId = z.string().uuid().brand("AgreementId");
export type AgreementId = z.infer<typeof AgreementId>;

export const AgreementDocumentId = z
  .string()
  .uuid()
  .brand("AgreementDocumentId");
export type AgreementDocumentId = z.infer<typeof AgreementDocumentId>;

export const AttributeId = z.string().uuid().brand("AttributeId");
export type AttributeId = z.infer<typeof AttributeId>;

export const DescriptorId = z.string().uuid().brand("DescriptorId");
export type DescriptorId = z.infer<typeof DescriptorId>;

export const TenantId = z.string().uuid().brand("TenantId");
export type TenantId = z.infer<typeof TenantId>;

export const RiskAnalysisSingleAnswerId = z
  .string()
  .uuid()
  .brand("RiskAnalysisSingleAnswerId");
export type RiskAnalysisSingleAnswerId = z.infer<
  typeof RiskAnalysisSingleAnswerId
>;

export const RiskAnalysisMultiAnswerId = z
  .string()
  .uuid()
  .brand("RiskAnalysisMultiAnswerId");
export type RiskAnalysisMultiAnswerId = z.infer<
  typeof RiskAnalysisMultiAnswerId
>;

export const RiskAnalysisFormId = z.string().uuid().brand("RiskAnalysisFormId");
export type RiskAnalysisFormId = z.infer<typeof RiskAnalysisFormId>;

export const RiskAnalysisId = z.string().uuid().brand("RiskAnalysisId");
export type RiskAnalysisId = z.infer<typeof RiskAnalysisId>;

type IDS =
  | EServiceId
  | EServiceDocumentId
  | AgreementId
  | AgreementDocumentId
  | DescriptorId
  | AttributeId
  | TenantId
  | RiskAnalysisSingleAnswerId
  | RiskAnalysisMultiAnswerId
  | RiskAnalysisFormId
  | RiskAnalysisId;

export function generateId<T extends IDS>(): T {
  return uuidv4() as T;
}

export function unsafeBrandId<T extends IDS>(id: string): T {
  return id as T;
}
