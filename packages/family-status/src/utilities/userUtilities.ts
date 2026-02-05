import { UserModel } from "../model/domain/models.js";
export function getUserModelByCodiceFiscale(
  userModels: UserModel[],
  subjectId: string
): UserModel | null {
  if (!userModels || userModels.length === 0) {
    throw new Error(
      "La lista di UserModel non può essere vuota o non definita."
    );
  }

  const userModel = userModels.find(
    (model) => model.subject.subjectId === subjectId
  );

  return userModel || null;
}
