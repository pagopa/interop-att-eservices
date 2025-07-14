import { InsertFamilyStatus } from "./family-status.js";

type RawPayload = {
  subject: {
    subjectId: string;
    id: string;
    surname: string;
    name: string;
    gender: string;
    birthDate?: {
      eventDate: string;
      placeOfBirth?: {
        municipality?: {
          nameMunicipality: string;
          istatCode: string;
          acronymIstatProvince: string;
          placeDescription: string;
        };
        place?: {
          placeDescription: string;
          countryDescription: string;
          codState: string;
          provinceCounty: string;
        };
      };
    };
  };
  subjectLink?: {
    relationshipType?: string;
    startDate?: string;
    relationshipCode?: string;
    memberSequence?: string;
    startDateRelationship?: string;
    endDateRelationship?: string;
  };
};

export function flattenPayload(payload: RawPayload): InsertFamilyStatus {
  const s = payload.subject;
  const b = s.birthDate;
  const municipality = b?.placeOfBirth?.municipality;
  const place = b?.placeOfBirth?.place;

  return {
    id: s.id,
    subjectId: s.subjectId,
    surname: s.surname,
    name: s.name,
    gender: s.gender || null,
    birthDate: b?.eventDate || null,

    municipality_nameMunicipality: municipality?.nameMunicipality || null,
    municipality_istatCode: municipality?.istatCode || null,
    municipality_acronymIstatProvince:
      municipality?.acronymIstatProvince || null,
    municipality_placeDescription: municipality?.placeDescription || null,

    place_placeDescription: place?.placeDescription || null,
    place_countryDescription: place?.countryDescription || null,
    place_codState: place?.codState || null,
    place_provinceCounty: place?.provinceCounty || null,

    relationshipType: payload.subjectLink?.relationshipType || null,
    startDate: payload.subjectLink?.startDate || null,
    relationshipCode: payload.subjectLink?.relationshipCode || null,
    memberSequence: payload.subjectLink?.memberSequence || null,
    startDateRelationship: payload.subjectLink?.startDateRelationship || null,
    endDateRelationship: payload.subjectLink?.endDateRelationship || null,
  };
}
