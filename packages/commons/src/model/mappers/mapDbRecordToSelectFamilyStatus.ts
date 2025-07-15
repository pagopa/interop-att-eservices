import { DbRecord } from "../../types/dbRecord.js";
import { FamilyStatusDto } from "../../types/familyStatusDTO.js";

export function mapDbRecordToFamilyStatusDto(
  record: DbRecord
): FamilyStatusDto {
  return {
    uuid: record.uuid,
    subject: {
      subjectId: record.subjectId,
      id: record.id,
      surname: record.surname,
      name: record.name,
      gender: record.gender ?? null,
      birthDate: {
        eventDate: record.birthDate ?? null,
        placeOfBirth: {
          municipality: {
            nameMunicipality: record.municipality_nameMunicipality ?? null,
            istatCode: record.municipality_istatCode ?? null,
            acronymIstatProvince:
              record.municipality_acronymIstatProvince ?? null,
            placeDescription: record.municipality_placeDescription ?? null,
          },
          place: {
            placeDescription: record.place_placeDescription ?? null,
            countryDescription: record.place_countryDescription ?? null,
            codState: record.place_codState ?? null,
            provinceCounty: record.place_provinceCounty ?? null,
          },
        },
      },
    },
    subjectLink: {
      relationshipType: record.relationshipType ?? null,
      startDate: record.startDate ?? null,
      relationshipCode: record.relationshipCode ?? null,
      memberSequence: record.memberSequence ?? null,
      startDateRelationship: record.startDateRelationship ?? null,
      endDateRelationship: record.endDateRelationship ?? null,
    },
  };
}
