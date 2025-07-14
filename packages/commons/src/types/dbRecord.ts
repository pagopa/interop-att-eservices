export type DbRecord = {
  uuid: string;
  id: string;
  subjectId: string;
  surname: string;
  name: string;
  gender: string | null;
  birthDate: string | null;

  municipality_nameMunicipality: string | null;
  municipality_istatCode: string | null;
  municipality_acronymIstatProvince: string | null;
  municipality_placeDescription: string | null;

  place_placeDescription: string | null;
  place_countryDescription: string | null;
  place_codState: string | null;
  place_provinceCounty: string | null;

  relationshipType: string | null;
  startDate: string | null;
  relationshipCode: string | null;
  memberSequence: string | null;
  startDateRelationship: string | null;
  endDateRelationship: string | null;
};
