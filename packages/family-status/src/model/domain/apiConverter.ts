import { getUserModelByCodiceFiscale } from "../../utilities/userUtilities.js";
import {
  generateRandomUUID,
  isValidUUID,
} from "../../utilities/uuidUtilities.js";
import {
  BirthDateType,
  CriteriaTypeFS001,
  DataPreparationResponse,
  DataPreparationTemplate,
  DataPreparationTemplateResponse,
  DataSubjectsInstitution,
  EventPlaceType,
  SubjectIdType,
  GeneralityType,
  UserModel,
} from "./models.js";

export const dataPreparationTemplateToUserModel = (
  dataPreparationTemplate: DataPreparationTemplate | undefined,
  existingUUID?: string
): UserModel => ({
  uuid:
    existingUUID &&
    typeof existingUUID === "string" &&
    isValidUUID(existingUUID)
      ? existingUUID
      : generateRandomUUID(),
  subject: dataPreparationTemplate?.subject ?? {},
  subjectLink: dataPreparationTemplate?.subjectLink ?? {},
});

export const userModelToApiDataPreparationResponse = (
  userModel: UserModel | undefined
): DataPreparationResponse => ({
  uuid: userModel?.uuid,
});

export const userModelToApiDataPreparationResponseCf = (
  userModels: UserModel[] | null,
  codiceFiscale?: string | null
): DataPreparationResponse | null => {
  if (!userModels || userModels.length === 0) {
    return null; // Return undefined if the list of UserModel is empty or undefined
  }

  if (!codiceFiscale) {
    return null; // Return undefined if the list of UserModel is empty or undefined
  }
  // Find the UserModel with the specified codice fiscale
  const userModel = getUserModelByCodiceFiscale(userModels, codiceFiscale);

  if (!userModel) {
    return null; // Return undefined if UserModel with the specified codice fiscale is not found
  }

  // Return DataPreparationResponse with the uuid from the found UserModel
  return {
    uuid: userModel.uuid,
  };
};

export const userModelToApiDataPreparationTemplateResponse = (
  userModel: UserModel
): DataPreparationTemplateResponse => ({
  uuid: userModel?.uuid,
  subject: userModel?.subject,
  subjectLink: userModel?.subjectLink,
});

//* ********************************************************************************************************** */

export const UserModelToDataSubjectsInstitution = (
  userModel: UserModel
): DataSubjectsInstitution => ({
  generality: CriteriaTypeToGeneralityType(userModel.subject),
  subjectLink: userModel.subjectLink,
});

export const CriteriaTypeToGeneralityType = (
  subject: CriteriaTypeFS001
): GeneralityType => ({
  subjectId: subject.subjectId
    ? codiceFiscaleToApiTipoCodiceFiscale(subject.subjectId)
    : { subjectId: "", subjectIdValidity: "", dataAttributionValidity: "" },
  surname: subject.surname,
  noSurname: subject.surname == null ? "true" : "false",
  name: subject.name,
  noName: subject.name == null ? "true" : "false",
  gender: subject.gender,
  birthDate: subject.birthDate?.eventDate,
  noDay: "",
  noMonth: "",
  placeOfBirth: subject.birthDate
    ? BirthDateTypeToEventPlaceType(subject.birthDate)
    : {
        exceptionalPlace: undefined,
        municipality: undefined,
        place: undefined,
      },
  AIRESubject: "",
  yearExpatriation: "",
  idSubjectData: "",
  note: "",
});

export const codiceFiscaleToApiTipoCodiceFiscale = (
  subjectId: string
): SubjectIdType => ({
  subjectId,
  subjectIdValidity: "",
  dataAttributionValidity: "",
});

export const BirthDateTypeToEventPlaceType = (
  birthDateType: BirthDateType
): EventPlaceType => ({
  exceptionalPlace: birthDateType.placeOfBirth?.exceptionalPlace,
  municipality: birthDateType.placeOfBirth?.municipality,
  place: birthDateType.placeOfBirth?.place,
});

//* ********************************************************************************************************** */
