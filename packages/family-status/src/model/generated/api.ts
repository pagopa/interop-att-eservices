import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const MunicipalityType = z
  .object({
    nameMunicipality: z.string(),
    istatCode: z.string(),
    acronymIstatProvince: z.string(),
    placeDescription: z.string(),
  })
  .partial()
  .passthrough();
const PlaceType = z
  .object({
    placeDescription: z.string(),
    countryDescription: z.string(),
    codState: z.string(),
    provinceCounty: z.string(),
  })
  .partial()
  .passthrough();
const DataBirthType = z
  .object({
    exceptionalPlace: z.string(),
    municipality: MunicipalityType,
    place: PlaceType,
  })
  .partial()
  .passthrough();
const BirthDateType = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    placeOfBirth: DataBirthType,
  })
  .partial()
  .passthrough();
const CriteriaTypeFS001 = z
  .object({
    fiscalCode: z.string(),
    id: z.string(),
    surname: z.string(),
    nosurname: z.string(),
    name: z.string(),
    noname: z.string(),
    gender: z.string(),
    birthDate: BirthDateType,
  })
  .partial()
  .passthrough();
const CompleteSubjectBindingType = z
  .object({
    relationshipType: z.string(),
    startDate: z.string(),
    relationshipCode: z.string(),
    memberSequence: z.string(),
    startDateRelationship: z.string(),
  })
  .partial()
  .passthrough();
const DataPreparationTemplate = z
  .object({
    subject: CriteriaTypeFS001,
    subjectLink: CompleteSubjectBindingType,
  })
  .partial()
  .passthrough();
const DataPreparationResponse = z.object({ uuid: z.string() }).partial();
const DataPreparationTemplateResponse = z
  .object({ uuid: z.string().uuid() })
  .partial()
  .passthrough()
  .and(DataPreparationTemplate);
const DataTypeRquestFS001 = z
  .object({
    dateOfRequest: z.string(),
    motivation: z.string(),
    useCase: z.string(),
  })
  .passthrough();
const RequestFS001 = z
  .object({
    operationId: z.string(),
    criteria: CriteriaTypeFS001,
    requestData: DataTypeRquestFS001,
  })
  .passthrough();
const FiscalCodeType = z
  .object({
    fiscalCode: z.string(),
    fiscalCodeValidity: z.string(),
    dataAttributionValidity: z.string(),
  })
  .partial()
  .passthrough();
const EventPlaceType = z
  .object({
    exceptionalPlace: z.string(),
    municipality: MunicipalityType,
    place: PlaceType,
  })
  .partial()
  .passthrough();
const TypeIdSubjectCardCommon = z
  .object({ idCommonSubjectDataIstat: z.string(), idSubjectData: z.string() })
  .partial()
  .passthrough();
const GeneralityType = z
  .object({
    fiscalCode: FiscalCodeType,
    surname: z.string(),
    noSurname: z.string(),
    name: z.string(),
    noName: z.string(),
    gender: z.string(),
    birthDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    placeOfBirth: EventPlaceType,
    AIRESubject: z.string(),
    yearExpatriation: z.string(),
    idCommonSubjectData: TypeIdSubjectCardCommon,
    idSubjectData: z.string(),
    note: z.string(),
  })
  .partial()
  .passthrough();
const IdentifiersType = z
  .object({ idANPR: z.string() })
  .partial()
  .passthrough();
const Act = z
  .object({
    municipalityRegistration: MunicipalityType,
    municipalityOffice: z.string(),
    year: z.string(),
    part: z.string(),
    serie: z.string(),
    actNumber: z.string(),
    volume: z.string(),
    actDate: z.string(),
    transcript: z.string(),
  })
  .partial()
  .passthrough();
const ActANSC = z
  .object({
    idANSC: z.string(),
    municipalityRegistration: MunicipalityType,
    year: z.string(),
    municipalityOffice: z.string(),
    municipalityNumber: z.string(),
    actDate: z.string(),
    transcript: z.string(),
  })
  .partial()
  .passthrough();
const ActType = z
  .object({ act: Act, actANSC: ActANSC })
  .partial()
  .passthrough();
const EventDataType = z
  .object({
    eventDate: z.string(),
    noDay: z.string(),
    noMonth: z.string(),
    eventPlace: EventPlaceType,
    eventAct: ActType,
  })
  .partial()
  .passthrough();
const TypeInfoValue = z.enum(["A", "N", "S"]);
const InfoInstitutionType = z
  .object({
    id: z.string(),
    key: z.string(),
    value: TypeInfoValue,
    valueText: z.string(),
    valueData: z.string(),
    details: z.string(),
  })
  .partial()
  .passthrough();
const DataSubjectsInstitution = z
  .object({
    generality: GeneralityType,
    identifiers: IdentifiersType,
    deathDate: EventDataType,
    subjectLink: CompleteSubjectBindingType,
    infoInstitution: z.array(InfoInstitutionType),
  })
  .partial()
  .passthrough();
const TypeSubjects = z
  .object({ subject: z.array(DataSubjectsInstitution) })
  .partial()
  .passthrough();
const ErrorsType = z
  .object({
    warningErrorCode: z.string(),
    warningErrorType: z.string(),
    warningErrorText: z.string(),
    warningErrorObject: z.string(),
    warningErrorField: z.string(),
    warningErrorValue: z.string(),
  })
  .partial()
  .passthrough();
const ResponseFS001 = z
  .object({
    idOp: z.string(),
    subjects: TypeSubjects,
    warnings: z.array(ErrorsType),
  })
  .partial()
  .passthrough();
const ResponseKO = z
  .object({ idOp: z.string(), errors: z.array(ErrorsType) })
  .partial()
  .passthrough();

export const schemas = {
  MunicipalityType,
  PlaceType,
  DataBirthType,
  BirthDateType,
  CriteriaTypeFS001,
  CompleteSubjectBindingType,
  DataPreparationTemplate,
  DataPreparationResponse,
  DataPreparationTemplateResponse,
  DataTypeRquestFS001,
  RequestFS001,
  FiscalCodeType,
  EventPlaceType,
  TypeIdSubjectCardCommon,
  GeneralityType,
  IdentifiersType,
  Act,
  ActANSC,
  ActType,
  EventDataType,
  TypeInfoValue,
  InfoInstitutionType,
  DataSubjectsInstitution,
  TypeSubjects,
  ErrorsType,
  ResponseFS001,
  ResponseKO,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/family-status",
    alias: "FS001",
    description: `Search family status`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RequestFS001,
      },
    ],
    response: ResponseFS001,
    errors: [
      {
        status: 400,
        description: `Invalid request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Usage case not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/family-status/data-preparation",
    alias: "InsertFS001",
    description: `Insert data preparation family-status`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DataPreparationTemplate,
      },
    ],
    response: z.object({ uuid: z.string() }).partial(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/family-status/data-preparation",
    alias: "GetAllFS001",
    description: `List of institution use cases`,
    requestFormat: "json",
    response: z.array(DataPreparationTemplateResponse),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/family-status/data-preparation",
    alias: "DeleteAR001",
    description: `Delete institution use cases`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/family-status/data-preparation/:uuid",
    alias: "GetByIdAR001",
    description: `Get data preparation family status by UUID`,
    requestFormat: "json",
    parameters: [
      {
        name: "uuid",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: DataPreparationTemplate,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/family-status/data-preparation/:uuid",
    alias: "DeleteByIdAR001",
    description: `Remove a single use case`,
    requestFormat: "json",
    parameters: [
      {
        name: "uuid",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too Many Requests`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/family-status/status",
    alias: "getStatus",
    description: `Return ok`,
    requestFormat: "json",
    response: ResponseKO,
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
