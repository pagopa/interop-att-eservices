import {
  DbAddress as Address,
  DbPurpose as Purpose,
  DbSubject as Subject,
  DbUsecase as Usecase,
  MappedDbData,
} from "../domain/models.js";
import {
  mapToDbPurpose,
  mapSourceSubjectToDbSubject,
  mapSourceAddressToDbAddress,
  mapToDbUsecase
} from "../../utilities/mapUserModelUtilities.js";

// TODO: Make error handling for field missing or invalid

export function mapApiBodyToDbModels(subjectBody: any): MappedDbData {
  const addresses: Address[] = [];
  const usecases: Usecase[] = [];

  const subject: Subject = mapSourceSubjectToDbSubject(subjectBody);
  const purpose: Purpose = mapToDbPurpose();

  if (subjectBody.address && Array.isArray(subjectBody.address)) {
    for (const sourceAddress of subjectBody.address) {
      
      try {
        const newDbAddress = mapSourceAddressToDbAddress(sourceAddress);
        addresses.push(newDbAddress);
        if (
          typeof purpose.id === "string" &&
          typeof subject.uuid === "string" &&
          typeof newDbAddress.id === "string"
        ) {
          const newDbUsecase = mapToDbUsecase(
            purpose.id,
            subject.uuid,
            newDbAddress.id
          );
          usecases.push(newDbUsecase);
        } else {
          console.error(
            "Invalid id(s) for usecase:",
            JSON.stringify({ purposeId: purpose.id, subjectUuid: subject.uuid, addressId: newDbAddress.id })
          );
        }
      } catch (err) {
        console.error("Error creating usecase:", err);
      }
    }
  }

  return { purpose, subject, addresses, usecases };
}

// TODO: Fix the type of subjectBody and addressBody with subject_id
export function mapApiBodyToDbModelsUpdate(
  subjectBody: any,
  subjectUuid: string,
  addressUuid: string
): {
  subject: Subject;
  address: Address;
} {
  const subjectMapped = mapSourceSubjectToDbSubject(subjectBody);

  subjectMapped.uuid = subjectUuid;

  let mappedAddress: Address;
  const mapped = mapSourceAddressToDbAddress(
    subjectBody.address[0] // TODO: Fix array management
  );

  mapped.id = addressUuid || "";
  mappedAddress = mapped;

  return {
    subject: subjectMapped,
    address: mappedAddress,
  };
}
