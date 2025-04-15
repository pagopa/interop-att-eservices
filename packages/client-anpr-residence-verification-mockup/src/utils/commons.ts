import { createHash } from "crypto";

export const sha256 = (input: string): string => {
  return createHash("sha256").update(input).digest("hex");
};

export const encodeBase64 = (input: string): string => {
  return Buffer.from(input, "utf-8").toString("base64");
};

export const service_request_body = {
  idOperazioneClient: 123,
  criteriRicerca: {
    idANPR: "AF41450AS",
  },
  verifica: {
    residenza: {
      tipoIndirizzo: "1",
      indirizzo: {
        cap: "41026",
        comune: { nomeComune: "PAVULLO NEL FRIGNANO" },
        numeroCivico: {
          numero: "55",
          civicoInterno: { scala: "B4", interno1: "3" },
        },
      },
    },
  },
  datiRichiesta: {
    dataRiferimentoRichiesta: "2025-03-27",
    motivoRichiesta: "test-collaudo",
    casoUso: "C008",
  },
};

/*export const service_request_body = {
  idOperazioneClient: "my_client_operation",
  criteriRicerca: {
    codiceFiscale: "STTSGT90A01H501J",
  },
  datiRichiesta: {
    dataRiferimentoRichiesta: "2025-04-13",
    motivoRichiesta: "test-collaudo",
    casoUso: "test-collaudo",
  },
};*/
