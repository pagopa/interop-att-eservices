/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from "pdnd-models";
import { logger, userService, translateKeys } from "pdnd-common";
import {
  RichiestaAR001,
  RichiestaAR002,
  RispostaAR001,
  RispostaAR002OK,
  TipoParametriRicercaAR001,
} from "../model/domain/models.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../model/domain/apiConverter.js";
import {
  REQ_ITA_TO_ENG,
  RES_ENG_TO_ITA_KEYS,
} from "../utilities/residence-mappings.js";
import { InternalRequestAR002 } from "../model/internal-model.js";
import {
  validateFullRequest,
  getValueByPath,
  getUnknownRequestFields,
} from "../utilities/validation-helper.js";
import { residenceVerificationConfig } from "../config/config.js";
import {
  requestParamNotValid,
  userModelNotFound,
  unknownRequestField,
} from "../exceptions/errors.js";

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
    const unknownFields = getUnknownRequestFields(request, REQ_ITA_TO_ENG);
    if (unknownFields.length > 0) {
      throw unknownRequestField(unknownFields);
    }

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

    // Build the set of Italian response keys that correspond to fields present
    // in the original request, respecting the REQ_ITA_TO_ENG mapping.
    const allowedItalianKeys = this.buildAllowedItalianKeys(request);

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
          const infoSoggettoEnte = Object.entries(flatItalianObj)
            .filter(([chiave]) => allowedItalianKeys.has(chiave))
            .map(([chiave, valore], index) => {
              const isDate = chiave.toUpperCase().includes("DATA");

              return {
                id: String(index + 1),
                chiave,
                valore: (isDate ? "D" : "A") as "A" | "N" | "S" | "D",
                valoreTesto: String(valore || ""),
                valoreData: dataInserimentoResidenza,
                dettaglio: "",
              };
            });

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

  private buildAllowedItalianKeys(request: RichiestaAR002): Set<string> {
    const allowedKeys = new Set<string>();
    for (const [itaRequestPath, engRequestPath] of Object.entries(
      REQ_ITA_TO_ENG
    )) {
      const value = getValueByPath(request, itaRequestPath);
      if (value === undefined || value === null || value === "") {
        continue;
      }

      // Convert English request path → English response path:
      //   criteria.<field>  → subject.<field>
      //   check.<rest>      → <rest>  (e.g. check.address.X → address.X)
      const engResponsePath: string | null = engRequestPath.startsWith(
        "criteria."
      )
        ? `subject.${engRequestPath.slice("criteria.".length)}`
        : engRequestPath.startsWith("check.")
        ? engRequestPath.slice("check.".length)
        : null;

      if (engResponsePath === null) {
        continue;
      }

      const itaResponseKey = RES_ENG_TO_ITA_KEYS[engResponsePath];
      if (itaResponseKey) {
        allowedKeys.add(itaResponseKey);
      }
    }
    return allowedKeys;
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
