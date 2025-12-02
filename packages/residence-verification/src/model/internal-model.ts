import { z } from "zod";
import * as api from "./generated/api.js";

export const TipoInfoValore = z.enum(["A", "N", "S"]);
export type TipoInfoValore = z.infer<typeof TipoInfoValore>;

export const TipoInfoSoggettoSchema = z
  .object({
    id: z.string(),
    key: z.string(),
    value: TipoInfoValore,
    textValue: z.string(),
    dataValue: z.string(),
    otherData: z.string(),
  })
  .partial()
  .passthrough();
export type TipoInfoSoggetto = z.infer<typeof TipoInfoSoggettoSchema>;

export const InfoSoggettoEnteSchema = z
  .object({
    infoInstitution: z.array(TipoInfoSoggettoSchema),
  })
  .partial()
  .passthrough();
export type InfoSoggettoEnte = z.infer<typeof InfoSoggettoEnteSchema>;

export const VerifyTipoDatiSubjectsSchema = z
  .object({
    infoSubject: z.array(InfoSoggettoEnteSchema),
  })
  .partial()
  .passthrough();
export type VerifyTipoDatiSubjects = z.infer<
  typeof VerifyTipoDatiSubjectsSchema
>;

const TipoLocalitaEsteraInternal = z
  .object({
    foreignAddress: api.schemas.TipoIndirizzoEstero.optional(),
    consulate: api.schemas.TipoConsolato.optional(),
  })
  .partial()
  .passthrough();

const TipoVerificaResidenzaInternal = z
  .object({
    addressType: z.string().optional(),
    address: api.schemas.TipoIndirizzo.optional(),
    foreignState: TipoLocalitaEsteraInternal.optional(),
  })
  .partial()
  .passthrough();

const TipocriteriaInternal = z
  .object({
    subjectId: z.string(),
    id: z.string(),
    surname: z.string(),
    noSurname: z.string(),
    name: z.string(),
    noName: z.string(),
    gender: z.string(),
    birthDate: api.schemas.TipoDatiNascitaE000,
  })
  .partial()
  .passthrough();

const TipoVerificaInternal = z
  .object({
    address: TipoVerificaResidenzaInternal,
  })
  .partial()
  .passthrough();

const TipoRequestDataInternal = z
  .object({
    dateOfRequest: z.string(),
    motivation: z.string(),
    useCase: z.string(),
  })
  .passthrough();

export const InternalRequestAR002 = z
  .object({
    operationId: z.string(),
    criteria: TipocriteriaInternal,
    check: TipoVerificaInternal.optional(),
    requestData: TipoRequestDataInternal,
  })
  .passthrough();

export type InternalRequestAR002 = z.infer<typeof InternalRequestAR002>;
