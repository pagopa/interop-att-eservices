/* eslint-disable functional/no-let */
import { logger } from "pdnd-common";
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
  mapToDbUsecase,
} from "../../utilities/mapUserModelUtilities.js";

// TODO: Make error handling for field missing or invalid
// TODO: Use const instead of let
export function mapApiBodyToDbModels(
  subjectBody: Record<string, unknown>
): MappedDbData {
  let addresses: Address[] = [];
  let usecases: Usecase[] = [];

  const subject: Subject = mapSourceSubjectToDbSubject(subjectBody);
  const purpose: Purpose = mapToDbPurpose();

  if (Array.isArray(subjectBody.address)) {
    subjectBody.address.forEach((sourceAddress) => {
      try {
        const newDbAddress = mapSourceAddressToDbAddress(sourceAddress);
        addresses = [...addresses, newDbAddress];
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
          usecases = [...usecases, newDbUsecase];
        } else {
          throw new Error("Error during map conversion");
        }
      } catch {
        logger.error("Error during map conversion:", sourceAddress);
      }
    });
  }

  return {
    purpose,
    subject,
    addresses,
    usecases,
  };
}

// TODO: Fix the type of subjectBody and addressBody with subject_id
export function mapApiBodyToDbModelsUpdate(
  subjectBody: Record<string, unknown>,
  subjectUuid: string,
  addressUuid: string
): {
  subject: Subject;
  address: Address;
} {
  try {
    const subjectMapped = {
      ...mapSourceSubjectToDbSubject(subjectBody),
      uuid: subjectUuid,
    };
    const mapped = mapSourceAddressToDbAddress(
      Array.isArray(subjectBody.address)
        ? subjectBody.address[0]
        : subjectBody.address
    );
    const address = { ...mapped, id: addressUuid || "" };
    return {
      subject: subjectMapped,
      address,
    };
  } catch (error) {
    logger.error("Errore durante la conversione di subject/address:", error);
    throw error;
  }
}
