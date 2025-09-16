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

export const CriteriaTypeFS001 = z
  .object({
    subjectId: z.string(),
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
