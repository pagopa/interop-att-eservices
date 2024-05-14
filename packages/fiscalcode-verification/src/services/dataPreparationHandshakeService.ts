import { logger } from "pdnd-common";
import { HandshakeModel } from "pdnd-models";
import { getContext } from "pdnd-common";
import dataPreparationHandshakeRepository from "../repository/dataPreparationHandshakeRepository.js";
import {
  appendUniqueHandshakeModelsToArray,
  isCertUnique,
} from "../utilities/handshakeUtilities.js";
import { certNotValidError } from "../exceptions/errors.js";

class DataPreparationHandshakeService {
  public appContext = getContext();
  private key: string = "fiscalcode-verification-handshake";

  public async saveList(
    handshakeModel: HandshakeModel
  ): Promise<HandshakeModel[] | null> {
    try {
      logger.info(`[START] handshake-saveList`);
      const handshakeData: HandshakeModel[] = [handshakeModel];

      // recupera tutte le chiavi di handshake
      const persistedHandshakeData =
        await dataPreparationHandshakeRepository.findAllByKey(this.key);
      if (!isCertUnique(persistedHandshakeData, handshakeData)) {
        logger.info(
          "il certificato inserito è associato ad un altro pourposeId"
        );
        throw certNotValidError(`The certificate is not valid`);
      }
      // se è vuota, la salvo senza ulteriori controlli
      if (
        persistedHandshakeData == null ||
        persistedHandshakeData.length === 0
      ) {
        await dataPreparationHandshakeRepository.saveList(
          handshakeData,
          this.key
        );
      } else {
        // esistono già chiavi, devo aggiungere la nuova, o sostituirla nel caso esista
        const allHandshake = appendUniqueHandshakeModelsToArray(
          persistedHandshakeData,
          handshakeData
        );
        await dataPreparationHandshakeRepository.saveList(
          allHandshake,
          this.key
        );
      }
      const response = await dataPreparationHandshakeRepository.findAllByKey(
        this.key
      );
      logger.info(`[END] handshake-saveList`);
      return response;
    } catch (error) {
      logger.error(
        `saveList [HANDSHAKE]- Errore durante il salvataggio della lista.`,
        error
      );
      throw error;
    }
  }

  public async getAll(): Promise<HandshakeModel[] | null> {
    try {
      logger.info(`[START] handshake-getAll`);
      // const hash = generateHash([this.appContext.authData.purposeId]);
      const response = await dataPreparationHandshakeRepository.findAllByKey(
        this.key
      );
      logger.info(`[END] handshake-getAll`);
      return response;
    } catch (error) {
      logger.error(
        `getAll [HANDSHAKE]: Errore durante il recupero della lista.`,
        error
      );
      throw error;
    }
  }

  public async deleteAllByKey(): Promise<number | null> {
    try {
      logger.info(`[START] handshake-deleteAllByKey`);
      // const hash = generateHash([this.appContext.authData.purposeId]);
      const response = await dataPreparationHandshakeRepository.deleteAllByKey(
        this.key
      );
      logger.info(`[END] handshake-deleteAllByKey`);
      return response;
    } catch (error) {
      logger.error(
        `UserService [HANDSHAKE]: Errore durante la cancellazione della lista. `,
        error
      );
      throw error;
    }
  }

  public async getByPurposeId(
    purposeId: string
  ): Promise<HandshakeModel | null> {
    try {
      logger.info(`[START] handshake-getByPurposeId`);
      // const hash = generateHash([this.appContext.authData.purposeId]);
      const response = await dataPreparationHandshakeRepository.findByPurposeId(
        this.key,
        purposeId
      );
      logger.info(`[END] handshake-getByPurposeId`);
      return response;
    } catch (error) {
      logger.error(
        `UserService [HANDSHAKE]: Errore durante la cancellazione della lista. `,
        error
      );
      throw error;
    }
  }
}

export default new DataPreparationHandshakeService();
