import { UserModel } from "pdnd-models";
import DataPreparationService from "../../src/services/DataPreparationService";
import { expect, test } from "vitest";
import dataPreparationRepository from "../../src/repository/dataPreparationRepository";
/* eslint-disable */
test('POST Data Preparation API', async () => {
    const testResponse: UserModel[] | null = await DataPreparationService.saveList(requestPostDataPreparation);
    let hasUuidProperty = false;
    if (testResponse && testResponse[0].hasOwnProperty('uuid')) {
        hasUuidProperty = true;
    }
    expect(hasUuidProperty).to.be.true;
});

test('GET GetAll Data Preparation API', async () => {
    const testResponse: UserModel[] | null = await DataPreparationService.getAll();
    let isCorrectCF = false;
    if (testResponse && testResponse[0].soggetto.codiceFiscale==="ABCDEF01G02H3453") {
        isCorrectCF = true;
    }
    expect(isCorrectCF).to.be.true;
});

test('GET GetByUuiD Data Preparation API', async () => {
    const testResponse = await DataPreparationService.getByUUID("48a6e56e-c7af-4fcf-928b-f240857621a8");
    let isCorrectCF = false;
    if (testResponse && testResponse.uuid==="48a6e56e-c7af-4fcf-928b-f240857621a8") {
        isCorrectCF = true;
    }
    expect(isCorrectCF).to.be.true;
});

const requestPostDataPreparation = {
    "soggetto": {
        "codiceFiscale": "ABCDEF01G02H3453",
        "idANPR": "123456780",
        "cognome": "Rossi",
        "nome": "Mario",
        "sesso": "M",
        "datiNascita": {
            "dataEvento": "2021-11-15",
            "senzaGiorno": "N/D",
            "luogoNascita": {
                "luogoEccezionale": "N/D",
                "comune": {
                    "nomeComune": "Roma",
                    "codiceIstat": "123456",
                    "siglaProvinciaIstat": "RM",
                    "descrizioneLocalita": "N/D"
                },
                "localita": {
                    "descrizioneLocalita": "N/D",
                    "descrizioneStato": "N/D",
                    "codiceStato": "N/D",
                    "provinciaContea": "N/D"
                }
            }
        }
    },
    "residenza": {
        "tipoIndirizzo": "Via",
        "noteIndirizzo": "N/D",
        "indirizzo": {
            "cap": "00100",
            "comune": {
                "nomeComune": "Roma",
                "codiceIstat": "123456",
                "siglaProvinciaIstat": "RM",
                "descrizioneLocalita": "N/D"
            },
            "frazione": "N/D",
            "toponimo": {
                "codSpecie": "1",
                "specie": "Via",
                "specieFonte": "N/D",
                "codToponimo": "123",
                "denominazioneToponimo": "Via Roma",
                "toponimoFonte": "N/D"
            },
            "numeroCivico": {
                "codiceCivico": "N/D",
                "civicoFonte": "N/D",
                "numero": "10",
                "metrico": "N/D",
                "progSNC": "N/D",
                "lettera": "A",
                "esponente1": "N/D",
                "colore": "N/D",
                "civicoInterno": {
                    "corte": "N/D",
                    "scala": "N/D",
                    "interno1": "N/D",
                    "espInterno1": "N/D",
                    "interno2": "N/D",
                    "espInterno2": "N/D",
                    "scalaEsterna": "N/D",
                    "secondario": "N/D",
                    "piano": "N/D",
                    "nui": "N/D",
                    "isolato": "N/D"
                }
            }
        },
        "localitaEstera": {
            "indirizzoEstero": {
                "cap": "12345",
                "localita": {
                    "descrizioneLocalita": "N/D",
                    "descrizioneStato": "N/D",
                    "codiceStato": "N/D",
                    "provinciaContea": "N/D"
                },
                "toponimo": {
                    "denominazione": "N/D",
                    "numeroCivico": "N/D"
                }
            },
            "consolato": {
                "codiceConsolato": "N/D",
                "descrizioneConsolato": "N/D"
            }
        },
        "presso": "N/D",
        "dataDecorrenzaResidenza": "2021-11-15"
    }
};

