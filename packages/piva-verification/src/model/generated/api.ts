import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const PartitaIva = z.string();
const DatapreparationTemplate = z
  .object({
    partitaIva: PartitaIva.min(11)
      .max(11)
      .regex(/^[0-9]+/),
  })
  .partial()
  .passthrough();
const DataPreparationResponse = z.array(
  z
    .object({
      partitaIva: PartitaIva.min(11)
        .max(11)
        .regex(/^[0-9]+/),
    })
    .partial()
    .passthrough()
);
const Richiesta = z
  .object({
    partitaIva: PartitaIva.min(11)
      .max(11)
      .regex(/^[0-9]+/),
  })
  .partial()
  .passthrough();
const VerificaPartitaIva = z
  .object({
    partitaIva: PartitaIva.min(11)
      .max(11)
      .regex(/^[0-9]+/),
    valida: z.boolean(),
    stato: z.enum(["ATTIVA", "CESSATA", "SOSPESA"]),
    denominazione: z.string(),
    dataInizioAttivita: z.string(),
    dataCessazioneAttivita: z.string(),
    dataInizioSospensione: z.string(),
    isGruppoIva: z.boolean(),
    partitaIvaGruppo: PartitaIva.min(11)
      .max(11)
      .regex(/^[0-9]+/),
    dataInizioPartecipazioneGruppoIva: z.string(),
    isPartecipanteGruppoIva: z.boolean(),
  })
  .partial()
  .passthrough();

export const schemas = {
  PartitaIva,
  DatapreparationTemplate,
  DataPreparationResponse,
  Richiesta,
  VerificaPartitaIva,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/piva-verification/data-preparation",
    alias: "postPivaVerificationdataPreparation",
    description: `Carica i casi d&#x27;uso dell&#x27;ente`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DatapreparationTemplate,
      },
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "x-correlation-id",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/piva-verification/data-preparation",
    alias: "getPivaVerificationdataPreparation",
    description: `Lista dei casi d&#x27;uso dell&#x27;ente`,
    requestFormat: "json",
    parameters: [
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "x-correlation-id",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: DataPreparationResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/piva-verification/data-preparation",
    alias: "reset",
    description: `Ritorna lo stato dell&#x27;applicazione: 200 se funziona correttamente
o un errore se l&#x27;applicazione è temporaneamente indisponibile
per manutenzione o per un problema tecnico.
`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Not authorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too many requests`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Service Unavailable`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/piva-verification/data-preparation/handshake",
    alias: "postPivaVerificationdataPreparationhandshake",
    description: `Carica il certificato nel formato .pem insieme a due campi nell&#x27;header.`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ certificate: z.instanceof(File) })
          .partial()
          .passthrough(),
      },
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/piva-verification/data-preparation/remove",
    alias: "postPivaVerificationdataPreparationremove",
    description: `Rimuove un preciso caso d&#x27;uso`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DatapreparationTemplate,
      },
      {
        name: "apikey",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "x-correlation-id",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/piva-verification/status",
    alias: "get_status",
    description: `Ritorna lo stato dell&#x27;applicazione: 200 se funziona correttamente
o un errore se l&#x27;applicazione è temporaneamente indisponibile
per manutenzione o per un problema tecnico.
`,
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/piva-verification/verifica",
    alias: "post_partita_iva",
    description: `Ritorna informazioni sulla validità della partita iva
e in caso di esito positivo vengono aggiunte alcune informazioni anagrafiche.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Richiesta,
      },
    ],
    response: VerificaPartitaIva,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Not authorized`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too many requests`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Service Unavailable`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
