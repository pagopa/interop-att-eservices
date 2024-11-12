import { z } from "zod";
import * as api from "../generated/api.js";


export type RequestFS001 = z.infer<typeof api.schemas.RequestFS001>;
export type ResponseFS001 = z.infer<typeof api.schemas.ResponseFS001>;
export type CriteriaTypeFS001 = z.infer<typeof api.schemas.CriteriaTypeFS001>;
export type DataTypeRquestFS001 = z.infer<typeof api.schemas.DataTypeRquestFS001>;
export type ErrorsType = z.infer<typeof api.schemas.ErrorsType>;
export type TypeSubjects = z.infer<typeof api.schemas.TypeSubjects>;
export type DataSubjectsInstitution = z.infer<typeof api.schemas.DataSubjectsInstitution>;
export type InfoInstitutionType = z.infer<typeof api.schemas.InfoInstitutionType>;
export type TypeInfoValue = z.infer<typeof api.schemas.TypeInfoValue>;
export type CompleteSubjectBindingType = z.infer<typeof api.schemas.CompleteSubjectBindingType>;
export type BirthDateType = z.infer<typeof api.schemas.BirthDateType>;
export type DataBirthType = z.infer<typeof api.schemas.DataBirthType>;
export type MunicipalityType = z.infer<typeof api.schemas.MunicipalityType>;
export type PlaceType = z.infer<typeof api.schemas.PlaceType>;
export type GeneralityType = z.infer<typeof api.schemas.GeneralityType>;
export type FiscalCodeType = z.infer<typeof api.schemas.FiscalCodeType>;
export type EventPlaceType = z.infer<typeof api.schemas.EventPlaceType>;
export type TypeIdSubjectCardCommon = z.infer<typeof api.schemas.TypeIdSubjectCardCommon>;
export type IdentifiersType = z.infer<typeof api.schemas.IdentifiersType>;
export type EventDataType = z.infer<typeof api.schemas.EventDataType>;
export type ActType = z.infer<typeof api.schemas.ActType>;
export type ActANSC = z.infer<typeof api.schemas.ActANSC>;
export type Act = z.infer<typeof api.schemas.Act>;
export type DataPreparationTemplate = z.infer<typeof api.schemas.DataPreparationTemplate>;
export type DataPreparationResponse = z.infer<typeof api.schemas.DataPreparationResponse>;
export type DataPreparationTemplateResponse = z.infer<typeof api.schemas.DataPreparationTemplateResponse>;

export const UserModel = z.object({
    uuid: z.string(),
    subject: api.schemas.CriteriaTypeFS001,
    subjectLink: api.schemas.CompleteSubjectBindingType,
});
export type UserModel = z.infer<typeof UserModel>;