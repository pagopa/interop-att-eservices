/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from "pdnd-models";
import { logger, userService, translateKeys } from "pdnd-common";
import {
import { RispostaAR002OK, RichiestaAR002 } from "../model/domain/models.js";
import {
  RichiestaAR001,
  RispostaAR001,
  TipoParametriRicercaAR001,
} from "../model/domain/models.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
import {
  REQ_ITA_TO_ENG,
  RES_ENG_TO_ITA_KEYS,
} from "../utilities/residence-mappings.js";
import { InternalRequestAR002 } from "../model/internal-model.js";
import { validateFullRequest } from "../utilities/validation-helper.js";
import { residenceVerificationConfig } from "../config/config.js";

class ResidenceVerificationController {
  public async findUser(request: RichiestaAR001): Promise<RispostaAR001> {
    const data = await this.getUserData(request);
    if (data.length === 0) {
      throw userModelNotFound("Codice fiscale non trovato");
    }
    return {
      idOp: request.operationId,
      subjects: {
        subject: data.map(UserModelToApiTipoDatiSoggettiEnte),
      },
    };
  }

  public async findUserVerify(
    request: RichiestaAR002
  ): Promise<RispostaAR002OK> {
    const internalRequest: InternalRequestAR002 = translateKeys(
      request,
      REQ_ITA_TO_ENG
    );

    const data = await this.getUserData(internalRequest);

    if (data.length === 0) {
      throw userModelNotFound();
    }
    const totalAnomalies = validateFullRequest(internalRequest, data);

    if (totalAnomalies.length > 0) {
      throw requestParamNotValid(JSON.stringify(totalAnomalies));
    }

    return {
      idOperazioneANPR: internalRequest.operationId,
      listaSoggetti: {
        datiSoggetto: data.map((user) => {
          const rawDate =
            user.address?.addressStartDate ||
            (user as any).address_start_date ||
            (user.address as any)?.address_start_date;

          const dataInserimentoResidenza = rawDate
            ? new Date(rawDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

          const flatItalianObj: RispostaAR002OK = translateKeys(
            user,
            RES_ENG_TO_ITA_KEYS,
            true
          );

          const infoSoggettoEnte = Object.entries(flatItalianObj).map(
            ([chiave, valore], index) => {
              const isDate = chiave.toUpperCase().includes("DATA");

              return {
                id: String(index + 1),
                chiave,
                valore: (isDate ? "D" : "A") as "A" | "N" | "S" | "D",
                valoreTesto: String(valore || ""),
                valoreData: dataInserimentoResidenza,
                dettaglio: "",
              };
            }
          );

          return { infoSoggettoEnte };
        }),
      },
      listaAnomalie: [],
    };
  }

  public async getRotatedSeed(eserviceId: string): Promise<string> {
    try {
      return await userService.generateSeed(
        eserviceId,
        residenceVerificationConfig
      );
    } catch (error) {
      logger.error(`Controller Error during getRotatedSeed`, error);
      throw error;
    }
  }

  private async getUserData(
    request: RichiestaAR001 | InternalRequestAR002
  ): Promise<UserModel[]> {
    try {
      const { subjectId } = request.criteria;

      if (subjectId) {
        return userService
          .getUserBySubjectId(subjectId)
          .then((user) => (user ? [user] : []));
      }

      if (this.checkPersonalInfo(request)) {
        const parametriDiRicerca: TipoParametriRicercaAR001 = request.criteria;

        return userService.getByPersonalInfo(parametriDiRicerca);
      }

      return [];
    } catch (error) {
      logger.error(`Controller Error during getUserData`, error);
      throw error;
    }
  }

  private checkPersonalInfo(
    request: RichiestaAR001 | InternalRequestAR002
  ): boolean {
    const birthDate = request.criteria.birthDate;
    return (
      !!request.criteria.name &&
      !!request.criteria.surname &&
      !!birthDate?.eventDate &&
      !!birthDate?.birthPlace?.municipality?.nameMunicipality &&
      !!birthDate?.birthPlace?.place?.codState
    );
  }
}
export default new ResidenceVerificationController();
