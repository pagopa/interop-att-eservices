import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

vi.mock("pdnd-common", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
  getContext: vi.fn().mockReturnValue({
    authData: { purposeId: "test-purpose-id", clientId: "test-client-id" },
    correlationId: "test-correlation-id",
  }),
}));

vi.mock("../src/services/residenceVerificationService.js", () => ({
  getUserBySubjectId: vi.fn(),
  getById: vi.fn(),
  getByPersonalInfo: vi.fn(),
}));

vi.mock("../src/exceptions/errors.js", () => ({
  requestParamNotValid: vi.fn((msg?: string) => {
    const err = new Error(msg ?? "Request param not valid from mock");
    (err as any).isRequestParamNotValid = true;
    throw err;
  }),
  userModelNotFound: vi.fn((msg?: string) => {
    const err = new Error(msg ?? "User model not found from mock");
    (err as any).isUserModelNotFound = true;
    throw err;
  }),
}));

vi.mock("../src/model/domain/apiConverter.js", () => ({
  UserModelToApiTipoDatiSoggettiEnte: vi.fn(),
}));

vi.mock("../src/utilities/equalsUtilities.js", () => ({
  checkInfoSoggettoEquals: vi.fn(),
}));

import residenceVerificationController from "../src/controllers/residenceVerificationController";
import {
  RichiestaAR001,
  RichiestaAR002,
  RispostaAR001,
  RispostaAR002OK,
  TipoInfoSoggetto,
} from "../src/model/domain/models";
import { Subject } from "../src/model/db/subject.model";
import { Address } from "../src/model/db/address.model";
import { mapUserModel } from "../src/utilities/mapUserModelUtilities";
import {
  UserModel,
  TipoDatiSoggettiEnteModel,
  TipoGeneralitaModel,
  TipoIdentificativiModel,
  TipoDatiEventoModel,
  TipoIdSchedaSoggettoComuneModel,
  TipoCodiceFiscaleModel,
} from "pdnd-models/dist";

import {
  getUserBySubjectId,
  getById,
  getByPersonalInfo,
} from "../src/services/residenceVerificationService.js";
import {
  requestParamNotValid,
  userModelNotFound,
} from "../src/exceptions/errors.js";
import { UserModelToApiTipoDatiSoggettiEnte } from "../src/model/domain/apiConverter.js";
import { checkInfoSoggettoEquals } from "../src/utilities/equalsUtilities.js";

const MOCK_OPERATION_ID = "test-op-util-map-123";
const MOCK_USER_UUID = "user-uuid-via-mapper-001";

const mockDbSubject: Subject = {
  subject_id: "RSSMRA85L15H501X",
  id: "internal-subject-id-001",
  surname: "Rossi",
  name: "Mario",
  gender: "M",
  birth_event_date: "1985-07-15",
  birth_exceptional_place: "Ospedale XYZ",
  birth_municipality_name: "Roma",
  birth_municipality_istat_code: "058091",
  birth_municipality_acronym_istat_province: "RM",
  birth_municipality_place_description: "Comune di Roma Capitale",
  birth_place_description: "ITALIA",
  birth_country_description: "Repubblica Italiana",
  birth_cod_state: "IT",
  birth_province_county: "RM",
  uuid: "mock-uuid-subject-001", // Valore concreto aggiunto
};

const mockDbAddress: Address = {
  address_type: "RESIDENZA_ANAGRAFICA",
  note_address: "Nessuna nota particolare.",
  address_start_date: "2010-01-20",
  presso: "Sig. Bianchi",
  address_municipality_name: "Roma",
  address_municipality_istat_code: "058091",
  address_municipality_acronym_istat_province: "RM",
  address_municipality_place_description: "Comune di Roma Capitale",
  toponym_cod_type: "VIA_COD",
  toponym_type: "VIA",
  toponym_origin_type: "Comunale",
  toponym_cod: "T001",
  toponym_denomination: "DELLA PACE",
  toponym_source: "Archivio Comunale",
  civic_cod: "CIV-COD-001",
  civic_source: "COMUNE",
  civic_number: "101",
  metric: "KM 12.5", // Valore concreto aggiunto
  prog_snc: "ProgSNC123", // Valore concreto aggiunto
  letter: "B",
  exponent1: "exp1", // Valore concreto aggiunto
  color: "ROSSO",
  internal_court: "Cortile 3", // Valore concreto aggiunto
  internal_stairs: "A",
  internal1: "5",
  esp_internal1: "espInt1", // Valore concreto aggiunto
  internal2: "App. 6", // Valore concreto aggiunto
  esp_internal2: "espInt2", // Valore concreto aggiunto
  external_stairs: "Scala Est", // Valore concreto aggiunto
  secondary: "Sec1", // Valore concreto aggiunto
  floor: "2",
  nui: "NUI789", // Valore concreto aggiunto
  isolated: "N",
  foreign_cap: "00184",
  foreign_place_description: "Parigi",
  foreign_country_description: "Francia",
  foreign_country_state: "FR",
  foreign_province_county: "Ile-de-France",
  foreign_toponym_denomination: "Rue de la Paix",
  foreign_toponym_civic_number: "23",
  consulate_cod: "CONS_PAR",
  consulate_description: "Consolato Italiano a Parigi",
  id: "internal-address-id-001", // Valore concreto aggiunto
};

let generatedMockUserModel: UserModel;
let generatedMockApiSubject: TipoDatiSoggettiEnteModel;

describe("ResidenceVerificationController", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const rawMappedUser = await mapUserModel(
      MOCK_USER_UUID,
      mockDbSubject,
      mockDbAddress
    );
    generatedMockUserModel = JSON.parse(JSON.stringify(rawMappedUser));

    const anagraficaSoggettoId: TipoCodiceFiscaleModel = {
      soggettoId: generatedMockUserModel.subject.subjectId,
      validitaSoggettoId: "VALIDO",
      dataAttribuzioneValidita: "2000-01-01",
    };
    const idSchedaSoggettoComune: TipoIdSchedaSoggettoComuneModel = {
      idSchedaSoggettoComuneIstat: "COMUNEROMA001",
      idSchedaSoggetto: "SCHEDA123",
    };

    const zodGeneralitaAPI: TipoGeneralitaModel = {
      soggettoId: anagraficaSoggettoId,
      cognome: generatedMockUserModel.subject.surname,
      nome: generatedMockUserModel.subject.name,
      sesso: generatedMockUserModel.subject.gender,
      dataNascita: generatedMockUserModel.subject.birthDate.eventDate,
      luogoNascita: {
        luogoEccezionale:
          generatedMockUserModel.subject.birthDate.birthPlace.exceptionalPlace,
        comune:
          generatedMockUserModel.subject.birthDate.birthPlace.municipality,
        localita: generatedMockUserModel.subject.birthDate.birthPlace.place,
      },
      senzaCognome: "N",
      senzaNome: "N",
      senzaGiorno: "N",
      senzaGiornoMese: "N",
      soggettoAIRE: "N",
      annoEspatrio: "2022",
      idSchedaSoggettoComune: idSchedaSoggettoComune,
      idSchedaSoggetto: "SCHEDASOGGETTO789",
      note: "Nessuna nota aggiuntiva per le generalità.",
    };
    const zodIdentificativiAPI: TipoIdentificativiModel = {
      id: generatedMockUserModel.uuid,
    };
    generatedMockApiSubject = {
      generalita: zodGeneralitaAPI,
      residenza: [generatedMockUserModel.address],
      identificativi: zodIdentificativiAPI,
      datiDecesso: { dataEvento: undefined } as TipoDatiEventoModel,
    };

    (UserModelToApiTipoDatiSoggettiEnte as Mock).mockImplementation(
      (userModel: UserModel) => {
        const expectedUserModelString = JSON.stringify(generatedMockUserModel);
        const actualUserModelString = JSON.stringify(userModel);

        if (actualUserModelString === expectedUserModelString) {
          return JSON.parse(JSON.stringify(generatedMockApiSubject));
        }

        console.error(
          "DISCREPANZA INTERNA AL MOCK DI UserModelToApiTipoDatiSoggettiEnte (confronto stringhe JSON):"
        );
        console.error(
          "ARGOMENTO RICEVUTO (userModel) JSON:",
          actualUserModelString
        );
        console.error(
          "ARGOMENTO ATTESO (generatedMockUserModel) JSON:",
          expectedUserModelString
        );
        throw new Error(
          "mockUserModelToApiTipoDatiSoggettiEnte: input non corrispondente alla condizione if del mock (basata su JSON.stringify)."
        );
      }
    );
    (checkInfoSoggettoEquals as Mock).mockReturnValue({
      codiceEsito: "0000",
      descrizioneEsito: "Confronto dati soggetto OK",
    });
  });

  describe("findUser", () => {
    it("should find a user by subjectId and return formatted data", async () => {
      const request: RichiestaAR001 = {
        operationId: MOCK_OPERATION_ID,
        criteria: { subjectId: generatedMockUserModel.subject.subjectId },
      };
      (getUserBySubjectId as Mock).mockResolvedValue(generatedMockUserModel);

      const response = (await residenceVerificationController.findUser(
        request
      )) as RispostaAR001;

      expect(getUserBySubjectId).toHaveBeenCalledWith(
        generatedMockUserModel.subject.subjectId
      );

      const actualArgumentForMapper = (
        UserModelToApiTipoDatiSoggettiEnte as Mock
      ).mock.calls[0][0];
      const normalizedActualArg = JSON.parse(
        JSON.stringify(actualArgumentForMapper)
      );
      const normalizedExpectedArg = JSON.parse(
        JSON.stringify(generatedMockUserModel)
      );

      expect(normalizedActualArg).toEqual(normalizedExpectedArg);

      expect(UserModelToApiTipoDatiSoggettiEnte).toHaveBeenCalledWith(
        expect.objectContaining(generatedMockUserModel),
        expect.any(Number),
        expect.any(Array)
      );
      expect(response.idOp).toBe(MOCK_OPERATION_ID);
      expect(response.subjects?.subject).toHaveLength(1);
      expect(response.subjects?.subject[0]).toEqual(generatedMockApiSubject);
    });

    it("should find a user by id (controller's user UUID) and return formatted data", async () => {
      const request: RichiestaAR001 = {
        operationId: MOCK_OPERATION_ID,
        criteria: { id: generatedMockUserModel.uuid },
      };
      (getById as Mock).mockResolvedValue(generatedMockUserModel);

      const response = (await residenceVerificationController.findUser(
        request
      )) as RispostaAR001;

      expect(getById).toHaveBeenCalledWith(generatedMockUserModel.uuid);

      const actualArgumentForMapper = (
        UserModelToApiTipoDatiSoggettiEnte as Mock
      ).mock.calls[0][0];
      const normalizedActualArg = JSON.parse(
        JSON.stringify(actualArgumentForMapper)
      );
      const normalizedExpectedArg = JSON.parse(
        JSON.stringify(generatedMockUserModel)
      );

      expect(normalizedActualArg).toEqual(normalizedExpectedArg);

      expect(UserModelToApiTipoDatiSoggettiEnte).toHaveBeenCalledWith(
        expect.objectContaining(generatedMockUserModel),
        expect.any(Number),
        expect.any(Array)
      );
      expect(response.subjects?.subject[0]).toEqual(generatedMockApiSubject);
    });

    it("should find users by personal info and return formatted data", async () => {
      const request: RichiestaAR001 = {
        operationId: MOCK_OPERATION_ID,
        criteria: {
          name: generatedMockUserModel.subject.name,
          surname: generatedMockUserModel.subject.surname,
          birthDate: {
            eventDate: generatedMockUserModel.subject.birthDate.eventDate,
            birthPlace: {
              municipality: {
                nameMunicipality:
                  generatedMockUserModel.subject.birthDate.birthPlace
                    .municipality.nameMunicipality,
              },
              place: {
                codState:
                  generatedMockUserModel.subject.birthDate.birthPlace.place
                    .codState,
              },
            },
          },
        },
      };
      (getByPersonalInfo as Mock).mockResolvedValue([generatedMockUserModel]);

      const response = (await residenceVerificationController.findUser(
        request
      )) as RispostaAR001;

      expect(getByPersonalInfo).toHaveBeenCalledWith(request.criteria);

      const actualArgumentForMapper = (
        UserModelToApiTipoDatiSoggettiEnte as Mock
      ).mock.calls[0][0];
      const normalizedActualArg = JSON.parse(
        JSON.stringify(actualArgumentForMapper)
      );
      const normalizedExpectedArg = JSON.parse(
        JSON.stringify(generatedMockUserModel)
      );

      expect(normalizedActualArg).toEqual(normalizedExpectedArg);

      expect(UserModelToApiTipoDatiSoggettiEnte).toHaveBeenCalledWith(
        expect.objectContaining(generatedMockUserModel),
        expect.any(Number),
        expect.any(Array)
      );
      expect(response.subjects?.subject[0]).toEqual(generatedMockApiSubject);
    });

    it("should throw requestParamNotValid if no user is found by subjectId", async () => {
      const request: RichiestaAR001 = {
        operationId: MOCK_OPERATION_ID,
        criteria: { subjectId: "non-existent-subject" },
      };
      (getUserBySubjectId as Mock).mockResolvedValue(null);
      const expectedErrorMessage =
        "The request body has one or more required param not valid";
      (requestParamNotValid as Mock).mockImplementationOnce(() => {
        throw new Error(expectedErrorMessage);
      });

      await expect(
        residenceVerificationController.findUser(request)
      ).rejects.toThrow(expectedErrorMessage);
      expect(requestParamNotValid).toHaveBeenCalledWith(expectedErrorMessage);
    });

    it("should throw requestParamNotValid if criteria are insufficient", async () => {
      const request: RichiestaAR001 = {
        operationId: MOCK_OPERATION_ID,
        criteria: { surname: "OnlySurname" },
      };
      const expectedErrorMessage =
        "The request body has one or more required param not valid";
      (requestParamNotValid as Mock).mockImplementationOnce(() => {
        throw new Error(expectedErrorMessage);
      });

      await expect(
        residenceVerificationController.findUser(request)
      ).rejects.toThrow(expectedErrorMessage);
      expect(requestParamNotValid).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });

  describe("findUserVerify", () => {
    it("should successfully verify a user with matching address by subjectId", async () => {
      const request: RichiestaAR002 = {
        operationId: MOCK_OPERATION_ID,
        criteria: { subjectId: generatedMockUserModel.subject.subjectId },
        check: {
          address: {
            toponym: {
              toponymDenomination:
                generatedMockUserModel.address.address.toponym
                  .toponymDenomination,
            },
            civicNumber: {
              civicNumber:
                generatedMockUserModel.address.address.civicNumber.civicNumber,
            },
            municipality: {
              nameMunicipality:
                generatedMockUserModel.address.address.municipality
                  .nameMunicipality,
              acronymIstatProvince:
                generatedMockUserModel.address.address.municipality
                  .acronymIstatProvince,
            },
          } as any,
        },
      };
      (getUserBySubjectId as Mock).mockResolvedValue(generatedMockUserModel);
      const mockVerificationResultOK: TipoInfoSoggetto = {
        codiceEsito: "0000",
        descrizioneEsito: "Confronto dati soggetto OK",
      };
      (checkInfoSoggettoEquals as Mock).mockReturnValue(
        mockVerificationResultOK
      );

      const response = (await residenceVerificationController.findUserVerify(
        request
      )) as RispostaAR002OK;

      expect(checkInfoSoggettoEquals).toHaveBeenCalledWith(
        request.check?.address,
        generatedMockUserModel
      );
      expect(response.subjects?.infoSubject[0]).toEqual(
        mockVerificationResultOK
      );
    });

    it("should throw userModelNotFound if user for verification is not found", async () => {
      const request: RichiestaAR002 = {
        operationId: MOCK_OPERATION_ID,
        criteria: { subjectId: "non-existent-for-verify" },
        check: { address: {} as any },
      };
      (getUserBySubjectId as Mock).mockResolvedValue(null);
      const expectedErrorMessage = "User model not found";
      (userModelNotFound as Mock).mockImplementationOnce(() => {
        throw new Error(expectedErrorMessage);
      });

      await expect(
        residenceVerificationController.findUserVerify(request)
      ).rejects.toThrow(expectedErrorMessage);
      expect(userModelNotFound).toHaveBeenCalled();
    });

    it("should return non-match if address data does not match", async () => {
      const request: RichiestaAR002 = {
        operationId: MOCK_OPERATION_ID,
        criteria: { subjectId: generatedMockUserModel.subject.subjectId },
        check: {
          address: {
            toponym: { toponymDenomination: "STRADA DIVERSA" },
          } as any,
        },
      };
      (getUserBySubjectId as Mock).mockResolvedValue(generatedMockUserModel);
      const mockVerificationResultNonMatch: TipoInfoSoggetto = {
        codiceEsito: "0001",
        descrizioneEsito: "Dati indirizzo non corrispondenti",
      };
      (checkInfoSoggettoEquals as Mock).mockReturnValue(
        mockVerificationResultNonMatch
      );

      const response = (await residenceVerificationController.findUserVerify(
        request
      )) as RispostaAR002OK;
      expect(response.subjects?.infoSubject[0]).toEqual(
        mockVerificationResultNonMatch
      );
    });
  });
});
