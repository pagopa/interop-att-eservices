export type FamilyStatusDto = {
  uuid: string;
  subject: {
    subjectId: string;
    id: string;
    surname: string;
    name: string;
    gender: string | null;
    birthDate: {
      eventDate: string | null;
      placeOfBirth: {
        municipality: {
          nameMunicipality: string | null;
          istatCode: string | null;
          acronymIstatProvince: string | null;
          placeDescription: string | null;
        };
        place: {
          placeDescription: string | null;
          countryDescription: string | null;
          codState: string | null;
          provinceCounty: string | null;
        };
      };
    };
  };
  subjectLink: {
    relationshipType: string | null;
    startDate: string | null;
    relationshipCode: string | null;
    memberSequence: string | null;
    startDateRelationship: string | null;
    endDateRelationship: string | null;
  };
};
