import { logger } from "pdnd-common";
import { getContext } from "pdnd-common";
import dataPreparationRepository from "../repository/dataPreparationRepository.js";
// import { mapUserModel } from "../utilities/mapUserModelUtilities.js";

class DataPreparationService {
  public appContext = getContext();

  public async findByUuid(uuid: string): Promise<any | null> {
    try {
      logger.info(`[START] findByUuid`);
      const result = await dataPreparationRepository.findByUuid(uuid);
      logger.info(`[END] findByUuid`);
      return result;
    } catch (error) {
      logger.error(
        `findByUuid - Errore durante il recupero del record.`,
        error
      );
      throw error;
    }
  }

  public async updateByUuid(uuid: string /* , body: any */): Promise<void> {
    try {
      logger.info(`[START] updateByUuid`);
      const existingRecord = await this.findByUuid(uuid);

      if (!existingRecord) {
        throw new Error(`Record con UUID ${uuid} non trovato.`);
      }


      // await dataPreparationRepository.updateSubjectByUuid(uuid, subjectData);

      logger.info(`[END] updateByUuid`);
    } catch (error) {
      logger.error(
        `updateByUuid - Errore durante l'aggiornamento del record.`,
        error
      );
      throw error;
    }
  }

  // private mapSubjectData(body: any): any {
  //   const subject = body.subjects.subject[0].generality;
  //   const birthPlace = subject.birthPlace;

  //   return {
  //     // ...mapGeneralData(subject),
  //     // subject_id: subject.subjectId.subjectId,
  //     // ...mapBirthData(birthPlace),
  //     // surname: subject.surname,
  //     // birth_exceptional_place: birthPlace?.exceptionalPlace,
  //     // municipality_name: birthPlace?.municipality?.nameMunicipality,
  //     // istat_code: birthPlace?.municipality?.istatCode,
  //     // province_acronym: birthPlace?.municipality?.acronymIstatProvince,
  //     // place_description: birthPlace?.place?.placeDescription,
  //     ...mapUserModel(subject)
  //   };
  // }

  // private mapAddressData(body: any): any[] {
  //   const addresses = body.subjects.subject[0].address;
  //   return addresses.map((address: any) => mapAddressData(address));
  // }
}

export default new DataPreparationService();
