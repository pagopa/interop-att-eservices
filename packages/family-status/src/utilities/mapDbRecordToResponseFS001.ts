import { DbRecord, ResponseFS001Type } from "pdnd-common";

export function mapDbRecordToResponseFS001(
  record: DbRecord,
  operationId: string
): ResponseFS001Type {
  const subject = {
    generality: {
      subjectId: {
        subjectId: record.subjectId,
        subjectIdValidity: "",
        dataAttributionValidity: "",
      },
      surname: record.surname,
      noSurname: "false",
      name: record.name,
      noName: "false",
      gender: record.gender ?? "",
      birthDate: record.birthDate ?? "",
      noDay: "",
      noMonth: "",
      placeOfBirth: {
        municipality: {
          nameMunicipality: record.municipality_nameMunicipality ?? "",
          istatCode: record.municipality_istatCode ?? "",
          acronymIstatProvince: record.municipality_acronymIstatProvince ?? "",
          placeDescription: record.municipality_placeDescription ?? "",
        },
        place: {
          placeDescription: record.place_placeDescription ?? "",
          countryDescription: record.place_countryDescription ?? "",
          codState: record.place_codState ?? "",
          provinceCounty: record.place_provinceCounty ?? "",
        },
      },
      AIRESubject: "",
      yearExpatriation: "",
      idSubjectData: "",
      note: "",
    },
    subjectLink: {
      relationshipType: record.relationshipType ?? "",
      startDate: record.startDate ?? "",
      relationshipCode: record.relationshipCode ?? "",
      memberSequence: record.memberSequence ?? "",
      startDateRelationship: record.startDateRelationship ?? "",
      endDateRelationship: record.endDateRelationship ?? "",
    },
  };

  return {
    idOp: operationId,
    subjects: {
      subject: [subject],
    },
  };
}
